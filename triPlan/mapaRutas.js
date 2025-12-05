import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

import {
  ordenarRutaPorDistancia,
  getMarkerImage,
  generarRutaConCalles
} from "./Funcionalidades/mapaHelpers";

// ----------------------
// Función auxiliar: distancia
// ----------------------
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRad = v => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
  
}

// ----------------------
// DETECCIÓN DE CERCANÍA
// ----------------------
function verificarCercania(userLoc, puntos) {
  const radio = 20;
  for (let punto of puntos) {
    if (punto.visitado) continue;

  const d = getDistance(
    userLoc.latitude,
    userLoc.longitude,
    Number(punto.latitud),
    Number(punto.longitud)
  );


    if (d < radio) return punto;
  }
  return null;
}

// ----------------------
// COMPONENTE PRINCIPAL
// ----------------------
export default function MapaRutas({
  ubicaciones = [],
  onMarkersUpdate,
  onStepsUpdate,
  onPoiDetected
}) {

  const [location, setLocation] = useState(null);
  const [selectedMarkers, setSelectedMarkers] = useState([]);
  const [routeCoords, setRouteCoords] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const primeraVez = useRef(true);

  const selectedMarkersRef = useRef([]);

  const [region] = useState({
    latitude: 42.8169,
    longitude: -1.6432,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  
  useEffect(() => {
    selectedMarkersRef.current = selectedMarkers;
  }, [selectedMarkers]);


  useEffect(() => {
  if (ubicaciones.length > 0) {
    const ubis = ubicaciones.map(p => ({ ...p, visitado: false }));
    setSelectedMarkers(ubis);
    selectedMarkersRef.current = ubis; // <--- actualizar ref aquí
    onMarkersUpdate && onMarkersUpdate(ubis);
  }
}, [ubicaciones]);

   useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const initial = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(initial.coords);

      const subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        (loc) => {
          setLocation(loc.coords);

          const puntoCercano = verificarCercania(
            loc.coords,
            selectedMarkersRef.current
          );

          if (puntoCercano) {
            onPoiDetected && onPoiDetected(puntoCercano);

            setSelectedMarkers(prev => {
              const updated = prev.map(p =>
                p.id === puntoCercano.id ? { ...p, visitado: true } : p
              );
              
              const todosVisitados = updated.every(p => p.visitado);
              
              if (todosVisitados && primeraVez.current) {
                primeraVez.current = false;
                
                setTimeout(() => {
                  Alert.alert(
                    "Ruta finalizada",
                    "¡Has completado todos los puntos de la ruta!",
                    [{text: "Aceptar"}]
                  );
                }, 100);
              }
              return updated;
            });
          }
        }
      );
      return () => subscription.remove();
    })();
  }, []);


  useEffect(() => {
    if (!location) return;

    const activos = selectedMarkers.filter(p => !p.visitado);

    if (activos.length === 0) {
      setRouteCoords([]);
      return;
    }

    (async () => {
      const orden = ordenarRutaPorDistancia(location, activos);

      const { coords, steps, totalDuration } = await generarRutaConCalles(
        location,
        orden
      );

      setRouteCoords(coords);
      setTotalDuration(totalDuration);
      onStepsUpdate && onStepsUpdate(steps);
    })();
  }, [location, selectedMarkers]);


  const formatDuration = (seconds) => {
    if (!seconds) return "";
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `${hours} h ${minutes % 60} min`;
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region} showsUserLocation>

        {selectedMarkers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{
              latitude: Number(m.latitud),
              longitude: Number(m.longitud),
            }}
            title={m.nombre}
            image={getMarkerImage(m.tipo)}
          />
        ))}

        {routeCoords.length > 1 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={6}
            strokeColor="#007AFF"
          />
        )}

      </MapView>

      {totalDuration > 0 && (
        <View style={styles.floatingTime}>
          <Text style={styles.floatingTimeText}>
            {formatDuration(totalDuration)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  floatingTime: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#99bce0ff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  floatingTimeText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
  }
});
