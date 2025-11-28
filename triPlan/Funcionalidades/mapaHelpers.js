import zonaImg from "../assets/markerZona.png";
import monumentoImg from "../assets/markerMonumento.png";
import edificioImg from "../assets/markerEdificio.png";
import gastronomiaImg from "../assets/markerGastronomia.png";
import arteImg from "../assets/markerArte.png";
import deporteImg from "../assets/markerDeporte.png";
import eventoImg from "../assets/markerEventos.png";
import zonaVerdeImg from "../assets/markerZonaVerde.png";

export async function obtenerRutaOSRM(origen, destino) {
    try {
        const url = `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${origen.lon},${origen.lat};${destino.lon},${destino.lat}?overview=full&geometries=geojson&steps=true`;

        const resp = await fetch(url);
        const data = await resp.json();

        if (!data.routes || data.routes.length === 0)
            return { coords: [], steps: [], duration: 0 };

        const coords = data.routes[0].geometry.coordinates.map((c) => ({
            latitude: c[1],
            longitude: c[0],
        }));

        const steps = data.routes[0].legs[0].steps.map((s) => ({
            distance: s.distance,
            street: s.name,
            latitud: s.maneuver.location[1],
            longitud: s.maneuver.location[0],
            instruction: traducirPaso(s),
        }));

        return { coords, steps, duration: data.routes[0].duration };
    } catch (err) {
        console.log("Error obteniendo ruta OSRM:", err);
        return { coords: [], steps: [], duration: 0 };
    }
}

export function getDistance(lat1, lon1, lat2, lon2) {
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

export function traducirPaso(step) {
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

export function modificadorEsp(mod) {
    switch (mod) {
        case "left":
            return "a la izquierda";
        case "right":
            return "a la derecha";
        case "straight":
            return "recto";
        case "slight left":
            return "ligeramente a la izquierda";
        case "slight right":
            return "ligeramente a la derecha";
        default:
            return "";
    }
}

export function ordenarRutaPorDistancia(userLoc, puntos) {
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
                Number(p.latitud),
                Number(p.longitud)
            );
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

export async function generarRutaConCalles(userLoc, puntosOrdenados) {
    if (!userLoc || puntosOrdenados.length === 0)
        return { coords: [], steps: [], totalDuration: 0 };

    const coordsTotales = [];
    const stepsTotales = [];
    let totalDuration = 0;

    let origen = {
        lat: userLoc.latitude,
        lon: userLoc.longitude,
    };

    for (let destino of puntosOrdenados) {
        const destinoCoords = {
            lat: Number(destino.latitud),
            lon: Number(destino.longitud),
        };

        const { coords, steps, duration } = await obtenerRutaOSRM(origen, destinoCoords);

        coordsTotales.push(...coords);
        stepsTotales.push(...steps);
        totalDuration += duration;

        origen = {
            lat: Number(destino.latitud),
            lon: Number(destino.longitud),
        };
    }

    return { coords: coordsTotales, steps: stepsTotales, totalDuration };
}

export function getMarkerImage(tipo) {
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
