import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

import zonaImg from "./assets/markerZona.png";
import monumentoImg from "./assets/markerMonumento.png";
import edificioImg from "./assets/markerEdificio.png";
import gastronomiaImg from "./assets/markerGastronomia.png";
import arteImg from "./assets/markerArte.png";
import deporteImg from "./assets/markerDeporte.png";
import eventoImg from "./assets/markerEventos.png";
import zonaVerdeImg from "./assets/markerZonaVerde.png";

async function obtenerRutaOSRM(origen, destino) {
  try {
    const url = `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${origen.lon},${origen.lat};${destino.lon},${destino.lat}?overview=full&geometries=geojson&steps=true`;

    const resp = await fetch(url);
    const data = await resp.json();

    if (!data.routes || data.routes.length === 0)
      return { coords: [], steps: [] };

    const coords = data.routes[0].geometry.coordinates.map((c) => ({
      latitude: c[1],
      longitude: c[0],
    }));

    const steps = data.routes[0].legs[0].steps.map((s) => ({
        distance: s.distance,
        street: s.name,
        lat: s.maneuver.location[1],
        lon: s.maneuver.location[0],
        instruction: traducirPaso(s)
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

  let origen = {
    lat: userLoc.latitude,
    lon: userLoc.longitude,
  };

  for (let destino of puntosOrdenados) {

    const destinoCoords = {
        lat: Number(destino.lat),
        lon: Number(destino.lon)
    };

    const { coords, steps } = await obtenerRutaOSRM(origen, destinoCoords);

    coordsTotales.push(...coords);
    stepsTotales.push(...steps);

    origen = { lat: Number(destino.lat), lon: Number(destino.lon) };
  }

  return { coords: coordsTotales, steps: stepsTotales };
}

// Distancia Haversine
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

function traducirPaso(step) {
  const type = step.maneuver.type;
  const modifier = step.maneuver.modifier || "";

  const calle = step.name ? ` por ${step.name}` : "";

  switch (type) {
    case "turn":
      return `Gira ${modificadorEsp(modifier)}${calle}`;
    case "end of road":
      return `Al final de la calle, gira ${modificadorEsp(modifier)}${calle}`;
    case "depart":
      if (modifier === "right") return `Comienza hacia la derecha${calle}`;
      if (modifier === "left") return `Comienza hacia la izquierda${calle}`;
      if (modifier === "straight") return `Comienza recto${calle}`;
      return `Comienza${calle}`;
    case "arrive":
      return "Has llegado a tu destino";
    case "continue":
      return `Sigue recto${calle}`;
    default:
      return "Continúa";
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


// Ordena los puntos por cercanía (TSP muy simple)
function ordenarRutaPorDistancia(userLoc, puntos) {
  if (!userLoc || puntos.length === 0) return [];

  const restantes = [...puntos];
  const rutaOrdenada = [];

  let actual = {
    lat: userLoc.latitude,
    lon: userLoc.longitude,
  };

  while (restantes.length > 0) {
    let nearest = null;
    let distMin = Infinity;

    restantes.forEach((p) => {
      const d = getDistance(
        actual.lat,
        actual.lon,
        Number(p.lat),
        Number(p.lon)
      );
      if (d < distMin) {
        distMin = d;
        nearest = p;
      }
    });

    rutaOrdenada.push(nearest);
    actual = { lat: nearest.lat, lon: nearest.lon };
    restantes.splice(restantes.indexOf(nearest), 1);
  }

  return rutaOrdenada;
}

function getMarkerImage(tipo) {
  switch (tipo) {
    case "Zonas":
      return zonaImg;
    case "Monumentos":
      return monumentoImg;
    case "Edificios":
      return edificioImg;
    case "Gastronomia":
      return gastronomiaImg;
    case "Arte":
      return arteImg;
    case "Deportes":
      return deporteImg;
    case "Eventos":
      return eventoImg;
    case "Zonas verdes":
      return zonaVerdeImg;
    default:
      return null;
  }
}

export default function MapaRutas({ ubicaciones = [], onMarkersUpdate, onStepsUpdate }) {
  const [location, setLocation] = useState(null);
  const [selectedMarkers, setSelectedMarkers] = useState([]);
  const [routeCoords, setRouteCoords] = useState([]);
  const [navigationSteps, setNavigationSteps] = useState([]);

  const [region, setRegion] = useState({
    latitude: 42.8169,
    longitude: -1.6432,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [activeMarker, setActiveMarker] = useState(null);
  const [lastDismissed, setLastDismissed] = useState({});
  const lastDismissedRef = useRef(lastDismissed);

  const cooldown = 15 * 60 * 1000; // 15 minutos

  // Mantener ref actualizado
  useEffect(() => {
    lastDismissedRef.current = lastDismissed;
  }, [lastDismissed]);

  //Tomar los primeros 5 puntos de la BD
  useEffect(() => {
    if (ubicaciones.length > 0) {
        const primeros5 = ubicaciones.slice(0, 5);
        setSelectedMarkers(primeros5);

        if (onMarkersUpdate) {
        onMarkersUpdate(primeros5);  // ✅ enviamos los puntos al padre
        }
    }
    }, [ubicaciones]);

  //Calcular ubicación del usuario + detectar zonas cercanas
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

          // Detectar punto más cercano
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

          if (navigationSteps.length > 0) {
            const step = navigationSteps[0];

            if (step.lat && step.lon) {
                const dist = getDistance(
                loc.coords.latitude,
                loc.coords.longitude,
                step.lat,
                step.lon
                );

                if (dist < 12) {  // 12 metros ≈ paso completado
                const nuevos = navigationSteps.slice(1);
                setNavigationSteps(nuevos);
                if (onStepsUpdate) onStepsUpdate(nuevos);
                }
            }
          }

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

    //Generar ruta automática cuando haya ubicación + 5 puntos
    useEffect(() => {
        if (!location) return;
        if (selectedMarkers.length === 0) return;

        (async () => {
            const orden = ordenarRutaPorDistancia(location, selectedMarkers);
            const { coords, steps } = await generarRutaConCalles(location, orden);

            setRouteCoords(coords);
            setNavigationSteps(steps);

            if (onStepsUpdate) {
                onStepsUpdate(steps);  // ✅ CALLBACK CORRECTO
            }

        })();
    }, [location, selectedMarkers]);

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
            stylers: [{ visibility: "off" }],
          },
        ]}
      >
        {/*Marcadores normales */}
        {selectedMarkers.map((m) => (
        <Marker
            key={m.id}
            coordinate={{
            latitude: Number(m.lat),
            longitude: Number(m.lon),
            }}
            title={m.titulo}
            image={getMarkerImage(m.tipo)}
        />
        ))}

        {/*Ruta dibujada */}
        {routeCoords.length > 1 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={6}
            strokeColor="#007AFF"
          />
        )}
      </MapView>

      {/*Popup de proximidad */}
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
