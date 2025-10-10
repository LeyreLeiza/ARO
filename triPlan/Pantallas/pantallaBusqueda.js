import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";

export default function App() {
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

  //Render de cargar datos 
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  //Si hay un error coloca texto rojo de error
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </View>
    );
  }

  //devuelve datos -> variable puntos metida y mostrada en un ScrollView
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { marginTop: 0 }]}>Puntos de interés</Text>
      <ScrollView>  
        {puntos.length === 0 ? (
          <Text>No hay datos disponibles</Text>
        ) : (
          puntos.map((p, index) => (
            <Text key={index} style={styles.item}>
              {p.NOMBRE}
            </Text>
          ))
        )}
      </ScrollView>
    </View>
  );
}

//estilos
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  item: { fontSize: 18, marginBottom: 8 },
});