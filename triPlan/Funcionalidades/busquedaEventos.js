import React, { useEffect, useState } from "react";

export const useBuscaEventos = (tiposFiltro) => {
  const [eventosPorTipo, setEventosPorTipo] = useState([]);
  const [loadingPorTipo, setLoadingPorTipo] = useState(true);
  const [errorPorTipo, setErrorPorTipo] = useState(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoadingPorTipo(true);

        const url = tiposFiltro && tiposFiltro.length > 0 && !tiposFiltro.includes('Todos')
        ? `https://aro-1nwv.onrender.com/eventos/tipo/${tiposFiltro.join(',')}`
        : "https://aro-1nwv.onrender.com/eventos";  // Si tiposFiltro incluye 'Todos', no aplicamos ningún filtro, se traen todos los eventos

        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        
        const data = await response.json();
        setEventosPorTipo(data);
      } catch (err) {
        console.error("Error cargando eventos:", err);
        setErrorPorTipo(err.message);
      } finally {
        setLoadingPorTipo(false);
      }
    };

    fetchEventos();
  }, [tiposFiltro]); 

  return { eventosPorTipo, loadingPorTipo, errorPorTipo };
};


export const useBuscaEventosPorNombre = (nombre) => {
  const [eventosPorNombre, setEventosPorNombre] = useState([]);
  const [loadingPorNombre, setLoadingPorNombre] = useState(true);
  const [errorPorNombre, setErrorPorNombre] = useState(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoadingPorNombre(true);
        let url = "";
        if (!nombre.trim()) {
            url = `https://aro-1nwv.onrender.com/eventos/`;
        } else {
            url = `https://aro-1nwv.onrender.com/eventos/nombre/${nombre}`;
        }
          
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        const data = await response.json();
        setEventosPorNombre(data);
      } catch (err) {
        console.error("Error cargando eventos:", err);
        setErrorPorNombre(err.message);
      } finally {
        setLoadingPorNombre(false);
      }
    };

    fetchEventos();
  }, [nombre]);

  return { eventosPorNombre, loadingPorNombre, errorPorNombre };
};

export const obtenerTiposUnicos = async () => {
  try {
    const response = await fetch("https://aro-1nwv.onrender.com/eventos");
    if (!response.ok) throw new Error("Error al obtener eventos");

    const data = await response.json();

    const tipos = Array.from(new Set(data.map(e => e.tipo))).filter(Boolean);

    return ['Todos', ...tipos];
  } catch (error) {
    console.error("Error obteniendo tipos:", error);
    return ['Todos']; // fallback
  }
};

export const obtenerEventosPorRango = async (fechaIni, fechaFin) => {
  try {
    const response = await fetch(
      `https://aro-1nwv.onrender.com/eventos/rango?fecha_ini=${fechaIni}&fecha_fin=${fechaFin}`
    );

    if (!response.ok) throw new Error("Error al obtener eventos por rango");

    return await response.json();
  } catch (err) {
    console.error("Error obteniendo eventos por rango:", err);
    return [];
  }
};
