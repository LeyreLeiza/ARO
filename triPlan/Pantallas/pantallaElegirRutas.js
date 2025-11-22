import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DetalleRutaModal from "../Componentes/DetalleRutaModal";

const imagenRuta = require("../assets/simboloUbicacion.png"); // o el icono que uses

export default function PantallaElegirRutas({ navigation }) {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el filtrado
  const [searchName, setSearchName] = useState("");
  const [maxDuration, setMaxDuration] = useState("");

  // Estado para el modal
  const [selectedRoute, setSelectedRoute] = useState(null);

  // 🚀 Cargar rutas del servidor
  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const response = await fetch("https://aro-1nwv.onrender.com/rutas"); // ⚠️ cambia por tu endpoint real
        if (!response.ok) throw new Error("Error al obtener rutas");
        const data = await response.json();

        // Nos quedamos solo con nombre, descripción, duración y puntos de interés
        const rutasSimplificadas = data.map(ruta => ({
          id: ruta.id,
          nombre: ruta.nombre,
          descripcion: ruta.descripcion,
          duracion: ruta.duracion, // ✅ Añadimos duración
          puntos_interes: ruta.puntos_interes // ✅ Añadimos puntos de interés para el modal
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
    setSelectedRoute(ruta);
  };

  const handleStartRoute = () => {
    if (selectedRoute) {
      navigation.navigate("pantallaRutas", { ruta: selectedRoute });
      setSelectedRoute(null);
    }
  };

  // 🔍 Lógica de filtrado
  const rutasFiltradas = rutas.filter(ruta => {
    const matchesName = ruta.nombre.toLowerCase().includes(searchName.toLowerCase());
    const matchesDuration = maxDuration ? ruta.duracion <= parseInt(maxDuration) : true;
    return matchesName && matchesDuration;
  });

  const renderItem = ({ item }) => (
    <Pressable onPress={() => handlePress(item)}>
      <View style={styles.caja}>
        <View style={styles.row}>
          <Image source={imagenRuta} style={styles.imagenRuta} />
          <View style={styles.textContainer}>
            <Text style={styles.titulo}>{item.nombre}</Text>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
            {/* Mostramos la duración si existe */}
            {item.duracion !== undefined && (
              <Text style={styles.duracion}>⏱️ {item.duracion} min</Text>
            )}
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
    <View style={styles.container}>
      {/* 🔎 Sección de Filtros */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nombre..."
          value={searchName}
          onChangeText={setSearchName}
        />
        <TextInput
          style={styles.input}
          placeholder="Duración máx. (min)"
          value={maxDuration}
          onChangeText={setMaxDuration}
          keyboardType="numeric"
        />
      </View>

      <FlatList
        data={rutasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No se encontraron rutas</Text>
          </View>
        }
      />

      {/* Modal de Detalle de Ruta */}
      <DetalleRutaModal
        visible={!!selectedRoute}
        ruta={selectedRoute}
        onClose={() => setSelectedRoute(null)}
        onStartRoute={handleStartRoute}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  filterContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
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
    marginBottom: 5,
  },
  duracion: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "600",
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
    marginTop: 20,
  },
});
