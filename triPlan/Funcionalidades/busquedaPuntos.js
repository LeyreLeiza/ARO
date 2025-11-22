import React, { useEffect, useState } from "react";

export const useBuscaPuntos = (tiposFiltro) => {
  const [puntosPorTipo, setPuntosPorTipo] = useState([]);
  const [loadingPorTipo, setLoadingPorTipo] = useState(true);
  const [errorPorTipo, setErrorPorTipo] = useState(null);

  useEffect(() => {
    const fetchPuntos = async () => {
      try {
        setLoadingPorTipo(true);

        const url = tiposFiltro && tiposFiltro.length > 0 && !tiposFiltro.includes('Todos')
          ? `https://aro-1nwv.onrender.com/puntos/tipo/${tiposFiltro.join(',')}`
          : "https://aro-1nwv.onrender.com/puntos";  // Si tiposFiltro incluye 'Todos', no aplicamos ningún filtro, se traen todos los puntos

        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la respuesta del servidor');

        const data = await response.json();
        setPuntosPorTipo(data);
      } catch (err) {
        console.error("Error cargando puntos:", err);
        setErrorPorTipo(err.message);
      } finally {
        setLoadingPorTipo(false);
      }
    };

    fetchPuntos();
  }, [tiposFiltro]);

  return { puntosPorTipo, loadingPorTipo, errorPorTipo };
};



export const useBuscaPuntosPorNombre = (nombre) => {
  const [puntosPorNombre, setPuntosPorNombre] = useState([]);
  const [loadingPorNombre, setLoadingPorNombre] = useState(true);
  const [errorPorNombre, setErrorPorNombre] = useState(null);

  useEffect(() => {
    const fetchPuntos = async () => {
      try {
        setLoadingPorNombre(true);
        let url = "";
        if (!nombre.trim()) {
          url = `https://aro-1nwv.onrender.com/puntos/`;
        } else {
          url = `https://aro-1nwv.onrender.com/puntos/nombre/${nombre}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        const data = await response.json();
        setPuntosPorNombre(data);
      } catch (err) {
        console.error("Error cargando puntos:", err);
        setErrorPorNombre(err.message);
      } finally {
        setLoadingPorNombre(false);
      }
    };

    fetchPuntos();
  }, [nombre]);

  return { puntosPorNombre, loadingPorNombre, errorPorNombre };
};