import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline, Callout } from "react-native-maps";
import * as Location from "expo-location";
import {
  obtenerRutaOSRM,
  ordenarRutaPorDistancia,
  getMarkerImage,
  generarRutaConCalles
} from "./Funcionalidades/mapaHelpers";

export default function MapaRutas({ ubicaciones = [], onMarkersUpdate, onStepsUpdate }) {
  const [location, setLocation] = useState(null);
  const [selectedMarkers, setSelectedMarkers] = useState([]);
  const [routeCoords, setRouteCoords] = useState([]);
  const [navigationSteps, setNavigationSteps] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);

  const [region, setRegion] = useState({
    latitude: 42.8169,
    longitude: -1.6432,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [activeMarker, setActiveMarker] = useState(null);
  const [lastDismissed, setLastDismissed] = useState({});
  const lastDismissedRef = useRef(lastDismissed);
  const cooldown = 15 * 60 * 1000;

  useEffect(() => {
    lastDismissedRef.current = lastDismissed;
  }, [lastDismissed]);

  // Tomar los primeros 5 puntos de la BD
  useEffect(() => {
    if (ubicaciones.length > 0) {
      const primeros5 = ubicaciones.slice(0, 5);
      setSelectedMarkers(primeros5);
      if (onMarkersUpdate) onMarkersUpdate(primeros5);
    }
  }, [ubicaciones]);

  // Localización y detección
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permiso de ubicación denegado");
        return;
      }

      // ✅ obtener ubicación inicial
      const initial = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(initial.coords);
      console.log("📍 Ubicación inicial:", initial.coords);

      const subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        (loc) => {
          setLocation(loc.coords);
        }
      );

      return () => subscription.remove();
    })();
  }, [ubicaciones]);

  // Generar ruta
  useEffect(() => {
    if (!location || selectedMarkers.length === 0) return;

    (async () => {
      console.log("🚀 Generando ruta con", selectedMarkers.length, "puntos");
      const orden = ordenarRutaPorDistancia(location, selectedMarkers);
      const { coords, steps, totalDuration } = await generarRutaConCalles(location, orden);

      setRouteCoords(coords);
      setNavigationSteps(steps);
      setTotalDuration(totalDuration);

      if (onStepsUpdate) onStepsUpdate(steps);
    })();
  }, [location, selectedMarkers]);

  const formatDuration = (seconds) => {
    if (!seconds) return "";
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `${hours} h ${remainingMins} min`;
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        customMapStyle={[{ featureType: "poi", stylers: [{ visibility: "off" }] }]}
      >
        {/* Marcadores */}
        {selectedMarkers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{
              latitude: Number(m.latitud),
              longitude: Number(m.longitud),
            }}
            title={m.titulo}
            image={getMarkerImage(m.tipo)}
          />
        ))}

        {/* Ruta */}
        {routeCoords.length > 1 && (
          <>
            <Polyline coordinates={routeCoords} strokeWidth={6} strokeColor="#007AFF" />
            {/* Duration Marker at the end */}
            <Marker coordinate={routeCoords[routeCoords.length - 1]}>
              <View style={styles.durationBubble}>
                <Text style={styles.durationText}>{formatDuration(totalDuration)}</Text>
              </View>
            </Marker>
          </>
        )}
      </MapView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    position: "relative",
  },
  popupTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  popupText: {
    fontSize: 16,
    textAlign: "center",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  durationBubble: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  durationText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
