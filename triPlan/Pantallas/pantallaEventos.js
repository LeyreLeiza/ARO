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
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PantallaEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [eventosFiltrados, setEventosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [tipos, setTipos] = useState(['Todos']);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('Todos');

  const fetchEventos = async () => {
    try {
      const response = await fetch('https://aro-1nwv.onrender.com/eventos');
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      setEventos(data);
      setEventosFiltrados(data);

      const tiposUnicos = Array.from(new Set(data.map(e => e.tipo))).filter(Boolean);
      setTipos(['Todos', ...tiposUnicos]);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  useEffect(() => {
    let filtrados = eventos;
    if (tipoSeleccionado !== 'Todos') {
      filtrados = filtrados.filter(e => e.tipo === tipoSeleccionado);
    }
    if (busqueda.trim() !== '') {
      filtrados = filtrados.filter(e =>
        e.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    setEventosFiltrados(filtrados);
  }, [busqueda, tipoSeleccionado, eventos]);

  const renderEvento = ({ item }) => (
    <View style={styles.card}>
      {item.imagen ? (
        <Image source={{ uri: item.imagen }} style={styles.imagen} />
      ) : (
        <View style={[styles.imagen, styles.imagenPlaceholder]}>
          <Ionicons name="image-outline" size={40} color="#888" />
        </View>
      )}
      <TouchableOpacity style={styles.iconoFavorito}>
        <Ionicons name="heart-outline" size={22} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconoCompartir}>
        <Ionicons name="share-social-outline" size={22} color="#000" />
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.etiqueta}>{item.tipo}</Text>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.descripcion}>{item.descripcion}</Text>
        <View style={styles.infoFila}>
          <Ionicons name="calendar-outline" size={16} color="#777" />
          <Text style={styles.infoTexto}>
            {new Date(item.fecha_ini).toLocaleDateString()} →{' '}
            {new Date(item.fecha_fin).toLocaleDateString()}
          </Text>
        </View>
        {item.punto?.nombre && (
          <View style={styles.infoFila}>
            <Ionicons name="location-outline" size={16} color="#777" />
            <Text style={styles.infoTexto}>{item.punto.nombre}</Text>
          </View>
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

  const anchoBoton = Math.min(Dimensions.get('window').width / 4.5, 90);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Eventos</Text>
      <Text style={styles.subtitulo}>Descubre eventos cerca de ti</Text>

      {/* 🔍 Buscador */}
      <View style={styles.buscadorContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={{ marginRight: 6 }} />
        <TextInput
          placeholder="Buscar eventos..."
          value={busqueda}
          onChangeText={setBusqueda}
          style={styles.inputBusqueda}
          placeholderTextColor="#999"
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* 🟢 Filtros */}
      <View style={{ height: 50, marginBottom: 12 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', paddingRight: 10 }}
        >
          {tipos.map(tipo => (
            <TouchableOpacity
              key={tipo}
              style={[
                styles.filtro,
                { width: anchoBoton },
                tipoSeleccionado === tipo && styles.filtroActivo,
              ]}
              onPress={() => setTipoSeleccionado(tipo)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filtroTexto,
                  tipoSeleccionado === tipo && styles.filtroTextoActivo,
                ]}
                numberOfLines={1}
              >
                {tipo}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de eventos */}
      {eventosFiltrados.length === 0 ? (
        <Text style={styles.sinResultados}>No hay eventos disponibles.</Text>
      ) : (
        <FlatList
          style={{ flex: 1 }} 
          data={eventosFiltrados}
          renderItem={renderEvento}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 60 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  titulo: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitulo: { fontSize: 14, color: '#666', marginBottom: 12 },
  buscadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
  },
  inputBusqueda: { flex: 1, color: '#333', fontSize: 14 },
  filtro: {
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    height: 38,
  },
  filtroActivo: { backgroundColor: '#000' },
  filtroTexto: { color: '#000', fontSize: 14, fontWeight: '500', textAlign: 'center' },
  filtroTextoActivo: { color: '#fff', fontWeight: '500' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  imagen: { width: '100%', height: 180 },
  imagenPlaceholder: { backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  iconoFavorito: {
    position: 'absolute',
    top: 10,
    right: 44,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
  },
  iconoCompartir: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
  },
  info: { padding: 12 },
  etiqueta: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  nombre: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  descripcion: { fontSize: 13, color: '#555', marginBottom: 6 },
  infoFila: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  infoTexto: { marginLeft: 6, color: '#777' },
  sinResultados: { textAlign: 'center', color: '#666', marginTop: 30 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666' },
});

export default PantallaEventos;