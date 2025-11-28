import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const imagenRuta = require("../assets/simboloUbicacion.png");
global.usuarioLogueado = global.usuarioLogueado || false;

export default function ListaRutas({ rutasFiltradas, personalizadas, loading, error, onSelect, navigation }) {
  const renderItem = ({ item }) => (
    <Pressable onPress={() => handlePress(item)}>
      <View style={styles.caja}>
        <View style={styles.row}>
          <Image source={imagenRuta} style={styles.imagenRuta} />
          <View style={styles.textContainer}>
            <Text style={styles.titulo}>{item.nombre}</Text>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
            {item.duracion !== undefined && (
              <Text style={styles.duracion}>⏱️ {item.duracion} min</Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={24} color="#aaa" />
        </View>
      </View>
    </Pressable>
  );

  const handlePress = (item) => {
    if (onSelect) {
      onSelect(item);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={styles.loadingText}>Cargando rutas...</Text>
      </View>
    );
  }

  if (personalizadas && !global.usuarioLogueado) {
    return (
      <View style={styles.noIniciadaSesion}>
        <Text style={styles.noIniciadaSesionTexto}>Inicia sesión para acceder a tus rutas personalizadas</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  } else {
    return (
      <FlatList
        data={rutasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No se encontraron rutas</Text>
          </View>
        }
        ListHeaderComponent={
          personalizadas ? (
            <Pressable style={styles.botonFooter} onPress={() => navigation.navigate("RutaPersonalizada")}>
              <FontAwesome name="plus-circle" size={48} color="#126baaff" style={styles.botonAdd} />
              <Text style={styles.botonFooterTitulo}>Crear nueva ruta</Text>
              <Text style={styles.botonFooterDescripcion}>Personaliza tu propia ruta con tus puntos favoritos</Text>
            </Pressable>
          ) : null
        }
      />
    );
  }
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
  noIniciadaSesion: {
    backgroundColor: "#e6f0ff",
    alignSelf: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#99c2ff",
    paddingVertical: 30,
    paddingHorizontal: 20,
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noIniciadaSesionTexto: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    lineHeight: 28,
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
  botonFooter: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    padding: 25,
    margin: 10,
    alignItems: 'center',
  },
  botonAdd: {
    marginBottom: 10,
  },
  botonFooterTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  botonFooterDescripcion: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
