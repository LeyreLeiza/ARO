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

import zonaImg from "./assets/markerZona.png";
import monumentoImg from "./assets/markerMonumento.png";
import edificioImg from "./assets/markerEdificio.png";
import gastronomiaImg from "./assets/markerGastronomia.png";
import arteImg from "./assets/markerArte.png";
import deporteImg from "./assets/markerDeporte.png";
import eventoImg from "./assets/markerEventos.png";
import zonaVerdeImg from "./assets/markerZonaVerde.png";

// ----------------------
// Funciones de ruta
// ----------------------
async function obtenerRutaOSRM(origen, destino) {
  try {
    const url = `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${origen.lon},${origen.lat};${destino.lon},${destino.lat}?overview=full&geometries=geojson&steps=true`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (!data.routes || data.routes.length === 0)
      return { coords: [], steps: [] };

    const coords = data.routes[0].geometry.coordinates.map(c => ({
      latitude: c[1],
      longitude: c[0],
    }));

    const steps = data.routes[0].legs[0].steps.map(s => ({
      distance: s.distance,
      street: s.name,
      latitud: s.maneuver.location[1],
      longitud: s.maneuver.location[0],
      instruction: traducirPaso(s),
    }));

    return { coords, steps };
  } catch (err) {
    console.log("Error obteniendo ruta OSRM:", err);
    return { coords: [], steps: [] };
  }
}

async function generarRutaConCalles(userLoc, puntosOrdenados) {
  if (!userLoc || puntosOrdenados.length === 0)
    return { coords: [], steps: [] };

  const coordsTotales = [];
  const stepsTotales = [];
  let origen = { lat: userLoc.latitude, lon: userLoc.longitude };

  for (let destino of puntosOrdenados) {
    const destinoCoords = { lat: Number(destino.latitud), lon: Number(destino.longitud) };
    const { coords, steps } = await obtenerRutaOSRM(origen, destinoCoords);

    coordsTotales.push(...coords);
    stepsTotales.push(...steps);

    origen = { lat: Number(destino.latitud), lon: Number(destino.longitud) };
  }

  return { coords: coordsTotales, steps: stepsTotales };
}

// ----------------------
// Funciones auxiliares
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

function traducirPaso(step) {
  const type = step.maneuver.type;
  const modifier = step.maneuver.modifier || "";
  const calle = step.name ? ` por ${step.name}` : "";

  switch (type) {
    case "turn": return `Gira ${modificadorEsp(modifier)}${calle}`;
    case "end of road": return `Al final de la calle, gira ${modificadorEsp(modifier)}${calle}`;
    case "depart":
      if (modifier === "right") return `Comienza hacia la derecha${calle}`;
      if (modifier === "left") return `Comienza hacia la izquierda${calle}`;
      if (modifier === "straight") return `Comienza recto${calle}`;
      return `Comienza${calle}`;
    case "arrive": return "Has llegado a tu destino";
    case "continue": return `Sigue recto${calle}`;
    default: return "Continúa";
  }
}

function modificadorEsp(mod) {
  switch (mod) {
    case "left": return "a la izquierda";
    case "right": return "a la derecha";
    case "straight": return "recto";
    case "slight left": return "ligeramente a la izquierda";
    case "slight right": return "ligeramente a la derecha";
    default: return "";
  }
}

function ordenarRutaPorDistancia(userLoc, puntos) {
  if (!userLoc || puntos.length === 0) return [];

  const restantes = [...puntos];
  const rutaOrdenada = [];
  let actual = { lat: userLoc.latitude, lon: userLoc.longitude };

  while (restantes.length > 0) {
    let nearest = null;
    let distMin = Infinity;

    restantes.forEach(p => {
      const d = getDistance(actual.lat, actual.lon, Number(p.latitud), Number(p.longitud));
      if (d < distMin) {
        distMin = d;
        nearest = p;
      }
    });

    rutaOrdenada.push(nearest);
    actual = { lat: nearest.latitud, lon: nearest.longitud };
    restantes.splice(restantes.indexOf(nearest), 1);
  }

  return rutaOrdenada;
}

function getMarkerImage(tipo) {
  switch (tipo) {
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

// ----------------------
// DETECCIÓN DE CERCANÍA CON ELIMINACIÓN DE PUNTO
// ----------------------
function verificarCercania(userLoc, puntos) {
  const radio = 20; // metros
  for (let punto of puntos) {
    const d = getDistance(userLoc.latitude, userLoc.longitude, Number(punto.latitud), Number(punto.longitud));
    if (d < radio) return punto;
  }
  return null;
}

// ----------------------
// Componente principal
// ----------------------
export default function MapaRutas({ ubicaciones = [], onMarkersUpdate, onStepsUpdate, onPoiDetected }) {
  const [location, setLocation] = useState(null);
  const [selectedMarkers, setSelectedMarkers] = useState([]);
  const [routeCoords, setRouteCoords] = useState([]);
  const [navigationSteps, setNavigationSteps] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);

  const [region] = useState({
    latitude: 42.8169,
    longitude: -1.6432,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const selectedMarkersRef = useRef([]);
  useEffect(() => { selectedMarkersRef.current = selectedMarkers; }, [selectedMarkers]);

  // Tomar primeros 5 puntos
  useEffect(() => {
    if (ubicaciones.length > 0) {
      const primeros5 = ubicaciones.slice(0, 5);
      setSelectedMarkers(primeros5);
      onMarkersUpdate && onMarkersUpdate(primeros5);
    }
  }, [ubicaciones]);

  // Localización y detección de puntos cercanos
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const initial = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(initial.coords);

      const subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        (loc) => {
          setLocation(loc.coords);

          const puntoCercano = verificarCercania(loc.coords, selectedMarkersRef.current);
          if (puntoCercano) {
            console.log("Punto cercano detectado:", puntoCercano.nombre);
            onPoiDetected && onPoiDetected(puntoCercano);

            // eliminar punto de la ruta
            setSelectedMarkers(prev => prev.filter(p => p.id !== puntoCercano.id));
          }
        }
      );

      return () => subscription.remove();
    })();
  }, [ubicaciones]);

  // Generar ruta automáticamente
  useEffect(() => {
    if (!location || selectedMarkers.length === 0) return;

    (async () => {
      const orden = ordenarRutaPorDistancia(location, selectedMarkers);
      const { coords, steps, totalDuration } = await generarRutaConCalles(location, orden);

      setRouteCoords(coords);
      setNavigationSteps(steps);
      setTotalDuration(totalDuration);
      onStepsUpdate && onStepsUpdate(steps);
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
        {selectedMarkers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: Number(m.latitud), longitude: Number(m.longitud) }}
            title={m.nombre}
            image={getMarkerImage(m.tipo)}
          />
        ))}

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
