import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PantallaEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [eventosFiltrados, setEventosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  const fetchEventos = async () => {
    try {
      const response = await fetch('https://aro-1nwv.onrender.com/eventos');
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      setEventos(data);
      setEventosFiltrados(data);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleBusqueda = (texto) => {
    setBusqueda(texto);
    if (texto.trim() === '') {
      setEventosFiltrados(eventos);
    } else {
      const filtro = eventos.filter((e) =>
        e.tipo?.toLowerCase().includes(texto.toLowerCase())
      );
      setEventosFiltrados(filtro);
    }
  };

  const renderEvento = ({ item }) => (
    <View style={styles.card}>
      {item.imagen ? (
        <Image source={{ uri: item.imagen }} style={styles.imagen} />
      ) : (
        item.punto?.imagen && <Image source={{ uri: item.punto.imagen }} style={styles.imagen} />
      )}

      <View style={styles.info}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.tipo}>{item.tipo}</Text>
        <Text style={styles.descripcion}>{item.descripcion}</Text>
        <Text style={styles.fecha}>
          {new Date(item.fecha_ini).toLocaleDateString()} -{' '}
          {new Date(item.fecha_fin).toLocaleDateString()}
        </Text>
        {item.punto?.nombre && (
          <Text style={styles.punto}> {item.punto.nombre}</Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6347" />
        <Text style={styles.loadingText}>Cargando eventos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔍 Barra de búsqueda */}
      <View style={styles.buscadorContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={{ marginRight: 6 }} />
        <TextInput
          placeholder="Buscar por tipo de evento..."
          value={busqueda}
          onChangeText={handleBusqueda}
          style={styles.inputBusqueda}
          placeholderTextColor="#999"
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => handleBusqueda('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista */}
      {eventosFiltrados.length === 0 ? (
        <Text style={styles.sinResultados}>No hay eventos que coincidan.</Text>
      ) : (
        <FlatList
          data={eventosFiltrados}
          renderItem={renderEvento}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 10,
  },
  buscadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
    elevation: 2,
  },
  inputBusqueda: {
    flex: 1,
    color: '#333',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  imagen: {
    width: '100%',
    height: 180,
  },
  info: {
    padding: 12,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  tipo: {
    fontSize: 14,
    color: '#ff6347',
    marginBottom: 4,
  },
  descripcion: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  fecha: {
    fontSize: 13,
    color: '#777',
  },
  punto: {
    marginTop: 6,
    fontSize: 13,
    color: '#333',
  },
  sinResultados: {
    textAlign: 'center',
    color: '#666',
    marginTop: 30,
    fontSize: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
});

export default PantallaEventos;
