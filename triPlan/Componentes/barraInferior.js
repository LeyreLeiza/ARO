// triPlan/Componentes/barraInferior.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BarraInferior({ navigation, activo }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Mapa')}>
        <Ionicons
          name="map-outline"
          size={24}
          color={activo === 'mapa' ? '#007AFF' : '#999'}
        />
        <Text style={[styles.texto, activo === 'mapa' && styles.textoActivo]}>Mapa</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Eventos')}>
        <Ionicons
          name="musical-notes-outline"
          size={24}
          color={activo === 'eventos' ? '#007AFF' : '#999'}
        />
        <Text style={[styles.texto, activo === 'eventos' && styles.textoActivo]}>Eventos</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Rutas')}>
        <Ionicons
          name="navigate-outline"
          size={24}
          color={activo === 'rutas' ? '#007AFF' : '#999'}
        />
        <Text style={[styles.texto, activo === 'rutas' && styles.textoActivo]}>Rutas</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Ajustes')}>
        <Ionicons
          name="settings-outline"
          size={24}
          color={activo === 'ajustes' ? '#007AFF' : '#999'}
        />
        <Text style={[styles.texto, activo === 'ajustes' && styles.textoActivo]}>Ajustes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  texto: {
    fontSize: 12,
    textAlign: 'center',
    color: '#999',
  },
  textoActivo: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
