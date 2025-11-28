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


        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "GW1FKVKqydjW8K0AJBmwpRgVhjx0mnNN2EuQv19PNW77M"
          }
        });
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
            url = `https://aro-1nwv.onrender.com/eventos/?`;
        } else {
            url = `https://aro-1nwv.onrender.com/eventos/nombre/${nombre}`;
        }
          
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "GW1FKVKqydjW8K0AJBmwpRgVhjx0mnNN2EuQv19PNW77M"
          }
        });
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
    const response = await fetch("https://aro-1nwv.onrender.com/eventos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "GW1FKVKqydjW8K0AJBmwpRgVhjx0mnNN2EuQv19PNW77M"
      }
    });
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
    let url;

    if (!fechaIni || !fechaFin) {
      url = "https://aro-1nwv.onrender.com/eventos";
    } else {
      url = `https://aro-1nwv.onrender.com/eventos/rango?fecha_ini=${fechaIni}&fecha_fin=${fechaFin}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "GW1FKVKqydjW8K0AJBmwpRgVhjx0mnNN2EuQv19PNW77M"
      }
    });
    if (!response.ok) throw new Error("Error en la respuesta del servidor");

    const data = await response.json();

    return data;  
  } catch (err) {
    console.error("Error obteniendo eventos por rango:", err);
    return [];
  }
};

export const obtenerEventosFavoritos = async (usuario_id) => {
  try {  
    const res = await fetch(`https://aro-1nwv.onrender.com/usuarios/eventos-favoritos/${usuario_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "GW1FKVKqydjW8K0AJBmwpRgVhjx0mnNN2EuQv19PNW77M"
      }
    });
    if (!res.ok) return [];

    const data = await res.json();
    return data.map(e => e.evento_id); 
  } catch (err) {
    console.error("Error obteniendo eventos favoritos:", err);
    return [];
  }
};

export const añadirEventoFavorito = async (usuario_id, evento_id) => {
  try {
    console.log("Llega");
    const res = await fetch(`https://aro-1nwv.onrender.com/usuarios/eventos-favoritos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "GW1FKVKqydjW8K0AJBmwpRgVhjx0mnNN2EuQv19PNW77M"
      },
      body: JSON.stringify({ usuario_id, evento_id })
    });

    const data = await res.json(); 

    if (!res.ok || data.error) {
      console.error("Error backend:", data.error || "Unknown");
      return false;
    }

    return res.ok;
  } catch (err) {
    console.error("Error al añadir evento favorito:", err);
    return false;
  }
};

export const eliminarEventoFavorito = async (usuario_id, evento_id) => {
  try {
    const res = await fetch(`https://aro-1nwv.onrender.com/usuarios/eventos-favoritos/${usuario_id}/${evento_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "GW1FKVKqydjW8K0AJBmwpRgVhjx0mnNN2EuQv19PNW77M"
      }
    });
    console.log(res.ok);
    return res.ok;
  } catch (err) {
    console.error("Error al eliminar evento favorito:", err);
    return false;
  }
};
