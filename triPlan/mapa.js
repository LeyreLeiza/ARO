import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import zonaImg from "./assets/markerZona.png";
import monumentoImg from "./assets/markerMonumento.png";
import edificioImg from "./assets/markerEdificio.png";
import gastronomiaImg from "./assets/markerGastronomia.png";
import arteImg from "./assets/markerArte.png";
import deporteImg from "./assets/markerDeporte.png";
import eventoImg from "./assets/markerEventos.png";
import zonaVerdeImg from "./assets/markerZonaVerde.png";

// Haversine
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRad = (v) => (v * Math.PI) / 180;

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

function getMarkerImage(tipo) {
  switch(tipo) {
    case "Zonas": return zonaImg;
    case "Monumentos": return monumentoImg;
    case "Edificios": return edificioImg;
    case "Gastronomia": return gastronomiaImg;
    case "Arte": return arteImg;
    case "Deportes": return deporteImg;
    case "Eventos": return eventoImg;
    case "Zonas verdes": return zonaVerdeImg;
    default: return null;
  }
}

export default function Mapa({ ubicaciones = [], onSelectPunto }) {

  const [location, setLocation] = useState(null);
  const [region] = useState({
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

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permiso de ubicación denegado");
        return;
      }

      const subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        (loc) => {
          setLocation(loc.coords);

          let nearest = null;
          let minDist = Infinity;

          ubicaciones.forEach((m) => {
            const d = getDistance(
              loc.coords.latitude,
              loc.coords.longitude,
              Number(m.latitud),
              Number(m.longitud)
            );
            if (d < minDist) {
              minDist = d;
              nearest = { ...m, distance: Math.round(d) };
            }
          });

          if (nearest && nearest.distance < 15) {
            const lastTime = lastDismissedRef.current[nearest.id] || 0;
            const now = Date.now();

            if (now - lastTime > cooldown) {
              setActiveMarker(nearest);
            }
          } else {
            setActiveMarker(null);
          }
        }
      );

      return () => subscription.remove();
    })();
  }, [ubicaciones]);

  return (
    <View style={styles.container}>
      
      <MapView 
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        customMapStyle={[
          {
            featureType: "poi",
            elementType: "all",
            stylers: [{ visibility: "off" }]
          }
        ]}
      >
        {(ubicaciones || []).map((m) => (
          <Marker
            key={m.id}
            coordinate={{
              latitude: Number(m.latitud),
              longitude: Number(m.longitud)
            }}
            title={m.nombre}
            image={getMarkerImage(m.tipo)}
            onPress={() => onSelectPunto && onSelectPunto(m)}
          />
        ))}
      </MapView>

      {activeMarker && (
        <View style={styles.popupOverlay}>
          <View style={styles.popup}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => {
                setLastDismissed((prev) => ({
                  ...prev,
                  [activeMarker.id]: Date.now(),
                }));
                setActiveMarker(null);
              }}
            >
              <Text style={styles.closeText}>✖</Text>
            </TouchableOpacity>

            <Text style={styles.popupTitle}>📍 {activeMarker.titulo}</Text>
            <Text style={styles.popupText}>
              Estás a {activeMarker.distance} metros de este lugar.
            </Text>
          </View>
        </View>
      )}

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
  },

  popupTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },

  popupText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },

  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },

  closeText: {
    fontSize: 22,
  },
});
