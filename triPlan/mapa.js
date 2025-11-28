import { useState, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
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
  const lastPointId = useRef(null); // 👉 RECORDAR EL ÚLTIMO PUNTO

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        (loc) => {
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
              nearest = { ...m, distance: d };
            }
          });

          if (!nearest) return;

          // 👉 Cambiar el número para ajustar la distancia
          const DISTANCIA_ACTIVACION = 20; // metros

          // ➤ SOLO ENTRA SI TE ACERCAS A UN PUNTO DIFERENTE
          if (nearest.distance < DISTANCIA_ACTIVACION &&
              nearest.id !== lastPointId.current) {

            lastPointId.current = nearest.id;
            if (onSelectPunto) onSelectPunto(nearest);
          }
        }
      );

      return () => subscription.remove();
    })();
  }, [ubicaciones]);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} showsUserLocation>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 }
});
