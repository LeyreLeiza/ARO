import React, { useEffect, useState } from "react";

export const useBuscaPuntos = () => {
    const [puntos, setPuntos] = useState([]);       //guardar informacion de puntos
    const [loading, setLoading] = useState(true);  // para mostrar cargando
    const [error, setError] = useState(null);     //para mostrar errores

    //carga los datos de la BD -> hace fetch
    useEffect(() => {
    const fetchPuntos = async () => {
        try {
        // Cambia localhost por la IP de tu PC si usas móvil físico
        const response = await fetch("http://10.17.123.98:10000/puntos");
        if (!response.ok) throw new Error("Error en la respuesta del servidor");
        const data = await response.json();
        setPuntos(data);
        } catch (err) {
        console.error("Error cargando datos:", err);
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    fetchPuntos();
    }, []);
    return { puntos, loading, error }; // devuelve array, loading y error
};