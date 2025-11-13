import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const imagenRuta = require("../assets/simboloUbicacion.png"); // o el icono que uses

export default function PantallaElegirRutas({ navigation }) {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🚀 Cargar rutas del servidor
  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const response = await fetch("https://aro-1nwv.onrender.com/rutas"); // ⚠️ cambia por tu endpoint real
        if (!response.ok) throw new Error("Error al obtener rutas");
        const data = await response.json();

        // Nos quedamos solo con nombre y descripción
        const rutasSimplificadas = data.map(ruta => ({
          id: ruta.id,
          nombre: ruta.nombre,
          descripcion: ruta.descripcion
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

  const handlePress = (ruta) => {
    navigation.navigate("pantallaRutas", { ruta });
  };

  const renderItem = ({ item }) => (
    <Pressable onPress={() => handlePress(item)}>
      <View style={styles.caja}>
        <View style={styles.row}>
          <Image source={imagenRuta} style={styles.imagenRuta} />
          <View style={styles.textContainer}>
            <Text style={styles.titulo}>{item.nombre}</Text>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#aaa" />
        </View>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={styles.loadingText}>Cargando rutas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={rutas}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.emptyText}>No se encontraron rutas</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  caja: {
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  imagenRuta: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  descripcion: {
    fontSize: 14,
    color: "#666",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  emptyText: {
    color: "#777",
    fontSize: 16,
  },
});
