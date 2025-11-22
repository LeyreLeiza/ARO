import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

export const useBuscaRutas = () => {
    const [rutas, setRutas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchRutas = async () => {
        try {
            const response = await fetch("https://aro-1nwv.onrender.com/rutas"); 
            if (!response.ok) throw new Error("Error al obtener rutas");
            const data = await response.json();

            const rutasSimplificadas = data.map(ruta => ({
            id: ruta.id,
            nombre: ruta.nombre,
            descripcion: ruta.descripcion,
            duracion: ruta.duracion, 
            puntos_interes: ruta.puntos_interes
            }));

            setRutas(rutasSimplificadas);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchRutas();
    }, []);
    return { rutas, loading, error };
 }

 export const useBuscaRutasPersonalizadas = (usuario_id, navigation) => {
    const [rutasPersonalizadas, setRutasPersonalizadas] = useState([]);
    const [loadingPersonalizadas, setLoadingPersonalizadas] = useState(true);
    const [errorPersonalizadas, setErrorPersonalizadas] = useState(null);

    const fetchRutas = async () => {
        if (!usuario_id) {
            setLoadingPersonalizadas(false);
            return;
        }
        try {
            setLoadingPersonalizadas(true);
            const response = await fetch(
                `https://aro-1nwv.onrender.com/usuarios/${usuario_id}/rutas-personalizadas`
            );

            if (!response.ok) throw new Error("Error al obtener rutas personalizadas");

            const data = await response.json();

            setRutasPersonalizadas(
                data.map(ruta => ({
                    id: ruta.id,
                    nombre: ruta.nombre,
                    descripcion: ruta.descripcion,
                    duracion: ruta.duracion,
                    puntos_interes: ruta.puntos_interes
                }))
            );
        } catch (err) {
            setErrorPersonalizadas(err.message);
        } finally {
            setLoadingPersonalizadas(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchRutas();
        }, [usuario_id])
    );

    return { rutasPersonalizadas, loadingPersonalizadas, errorPersonalizadas };
};
