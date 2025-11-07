import React, { useEffect, useState } from "react";


import { useState, useEffect } from 'react';

export const useBuscaPuntos = (tiposFiltro) => {
  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPuntos = async () => {
      try {
        setLoading(true);

        const url = tiposFiltro && tiposFiltro.length > 0 && !tiposFiltro.includes('Todos')
        ? `https://aro-1nwv.onrender.com/puntos/tipo/${tiposFiltro.join(',')}`
        : "https://aro-1nwv.onrender.com/puntos";  // Si tiposFiltro incluye 'Todos', no aplicamos ningún filtro, se traen todos los puntos

        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        
        const data = await response.json();
        setPuntos(data);
      } catch (err) {
        console.error("Error cargando puntos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPuntos();
  }, [tiposFiltro]); 

  return { puntos, loading, error };
};



export const useBuscaPuntosPorNombre = (nombre) => {
  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPuntos = async () => {
      try {
        setLoading(true);
        const url = `https://aro-1nwv.onrender.com/puntos/nombre/${nombre}`;
          
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        const data = await response.json();
        setPuntos(data);
      } catch (err) {
        console.error("Error cargando puntos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPuntos();
  }, [nombre]);

  return { puntos, loading, error };
};