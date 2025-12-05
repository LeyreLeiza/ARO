import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
// 🔹 Importamos el contexto
import { useFontSize } from '../Componentes/FontSizeContext';

export default function InformacionPunto({ punto, onBack }) {
  const { fontSizeMod } = useFontSize(); // 🔹 Obtenemos el modificador de tamaño

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.botonVolver} onPress={() => onBack()}>
          <Text style={[styles.botonTexto, { fontSize: 16 + fontSizeMod }]}>←</Text>
        </TouchableOpacity>

        {punto.imagen ? (
          <View style={styles.imagenContainer}>
            <Image style={styles.imagen} source={{ uri: punto.imagen }} />
          </View>
        ) : null}

        <View style={styles.textosContainer}>
          <Text style={[styles.titulo, { fontSize: 28 + fontSizeMod }]}>{punto.nombre}</Text>
          <Text style={[styles.tipo, { fontSize: 18 + fontSizeMod }]}>{punto.tipo}</Text>
        </View>

        <View style={styles.descripcionContainer}>
          <Text style={[styles.descripcion, { fontSize: 16 + fontSizeMod, lineHeight: 24 + fontSizeMod }]}>
            {punto.descripcion}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5', 
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
    backgroundColor: '#1e3a8a',
    alignSelf: 'flex-start',
    borderRadius: 8,
  },

  botonTexto: {
    color: '#fff',
    fontWeight: '700',
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
    fontWeight: '900',
    color: '#0b1d5d', 
    textAlign: 'center',
    marginBottom: 8,
  },

  tipo: {
    fontWeight: '600',
    color: '#4b5563', 
    textAlign: 'center',
  },

  descripcionContainer: {
    backgroundColor: '#fffdfaff', 
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  descripcion: {
    color: '#000', // texto negro
    textAlign: 'justify',
  },
});
