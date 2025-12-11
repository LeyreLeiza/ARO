import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Image } from "react-native";
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

const customMapStyle = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "transit",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }]
  }
];

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
  let markerImage;
  switch(tipo) {
    case "Zonas": markerImage = zonaImg; break;
    case "Monumentos": markerImage = monumentoImg; break;
    case "Edificios": markerImage = edificioImg; break;
    case "Gastronomia": markerImage = gastronomiaImg; break;
    case "Arte": markerImage = arteImg; break;
    case "Deportes": markerImage = deporteImg; break;
    case "Eventos": markerImage = eventoImg; break;
    case "Zonas verdes": markerImage = zonaVerdeImg; break;
    default: markerImage = null;
  }

  if (markerImage) {
    const imageSource = Image.resolveAssetSource(markerImage);
    return {
      uri: imageSource.uri,
    };
  }
  return null;
}

export default function Mapa({ ubicaciones = [], onSelectPunto }) {
  const lastPointId = useRef(null);
  const mapRef = useRef(null); // Para centrar el mapa programáticamente si se necesita

  // Punto de referencia fijo (solo para centrar el mapa)
  const puntoReferencia = {
    latitude: 42.81692327976999,
    longitude: -1.642821055102835,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

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

          const DISTANCIA_ACTIVACION = 20;

          if (
            nearest.distance < DISTANCIA_ACTIVACION &&
            nearest.id !== lastPointId.current
          ) {
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
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        showsBuildings={false} 
        showsPointsOfInterest={false}
        customMapStyle={customMapStyle}
        initialRegion={puntoReferencia} // 🔹 Centrado al abrir la app
      >
        {/* Solo los marcadores de ubicaciones dinámicas */}
        {(ubicaciones || []).map((m) => {
          const markerSource = getMarkerImage(m.tipo);
          if (!markerSource) return null;
          
          return (
            <Marker
              key={m.id}
              coordinate={{
                latitude: Number(m.latitud),
                longitude: Number(m.longitud)
              }}
              title={m.nombre}
              anchor={{ x: 0.5, y: 1 }}
              onPress={() => onSelectPunto && onSelectPunto(m)}
            >
              <Image
                source={markerSource}
                style={{ width: 30, height: 38 }}
                resizeMode="contain"
              />
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
