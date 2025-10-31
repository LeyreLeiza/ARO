import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InformacionPunto({ punto, onBack }) {
  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Botón de volver */}
        <TouchableOpacity style={styles.botonVolver} onPress={() => onBack()}>
          <Text style={styles.botonTexto}>← Volver</Text>
        </TouchableOpacity>

        {/* Imagen */}
        {punto.imagen ? (
          <View style={styles.imagenContainer}>
            <Image style={styles.imagen} source={{ uri: punto.imagen }} />
          </View>
        ) : null}

        {/* Título y tipo */}
        <View style={styles.textosContainer}>
          <Text style={styles.titulo}>{punto.titulo}</Text>
          <Text style={styles.tipo}>{punto.tipo}</Text>
        </View>

        {/* Zona de descripción */}
        <View style={styles.descripcionContainer}>
          <Text style={styles.descripcion}>{punto.descripcion}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5', // gris suave general
  },

  container: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 40,
  },

  botonVolver: {
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#1e3a8a', // azul oscuro
    alignSelf: 'flex-start',
    borderRadius: 8,
  },

  botonTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  imagenContainer: {
    borderRadius: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  imagen: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    resizeMode: 'cover',
  },

  textosContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },

  titulo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0b1d5d', // azul oscuro
    textAlign: 'center',
    marginBottom: 8,
  },

  tipo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4b5563', // gris más oscuro
    textAlign: 'center',
    fontStyle: 'italic',
  },

  descripcionContainer: {
    backgroundColor: '#fef9f0', // color cálido y claro distinto al gris
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  descripcion: {
    fontSize: 16,
    color: '#000', // texto negro
    lineHeight: 24,
    textAlign: 'justify',
  },
});
