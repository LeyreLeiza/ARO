// FontSizeContext.js
import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const FontSizeContext = createContext();

// Proveedor del contexto (se usará en App.js)
export const FontSizeProvider = ({ children }) => {
  const [fontSizeMod, setFontSizeMod] = useState(0); // 0 es el valor inicial (Medio)

  const cambiarTamano = (valor) => {
    setFontSizeMod(valor);
    // Mantenemos la variable global por si la usas en lógica fuera de React,
    // pero para la UI usaremos el estado del contexto.
    global.modLetraValor = valor; 
  };

  return (
    <FontSizeContext.Provider value={{ fontSizeMod, cambiarTamano }}>
      {children}
    </FontSizeContext.Provider>
  );
};

// Hook personalizado para usarlo fácil en cualquier pantalla
export const useFontSize = () => useContext(FontSizeContext);