import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

// Función Haversine para calcular distancia (en metros)
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

export default function Mapa({ ubicaciones = [] }) {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 42.8169,
    longitude: -1.6432,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [activeMarker, setActiveMarker] = useState(null);
  const [lastDismissed, setLastDismissed] = useState({});
  const lastDismissedRef = useRef(lastDismissed);

  const cooldown = 15 * 60 * 1000; // 2 min

  // Mantener ref actualizado
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
          setRegion((prev) => ({
            ...prev,
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          }));

          let nearest = null;
          let minDist = Infinity;

          ubicaciones.forEach((m) => {
            const d = getDistance(
              loc.coords.latitude,
              loc.coords.longitude,
              Number(m.lat),
              Number(m.lon)
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
      <MapView style={styles.map} region={region} showsUserLocation>
       
        {ubicaciones.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: Number(m.lon), longitude: Number(m.lat) }}
            title={m.titulo}
          />
        ))}
      </MapView>

      {/* POPUP grande en el centro */}
      {activeMarker && (
        <View style={styles.popupOverlay}>
          <View style={styles.popup}>
            {/* Botón cerrar en la esquina */}
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
});
