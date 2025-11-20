import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions, Modal  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBuscaEventos, useBuscaEventosPorNombre, obtenerTiposUnicos, obtenerEventosPorRango } from '../Funcionalidades/busquedaEventos';
import MiSelectorRango from '../Componentes/calendario';

const PantallaEventos = () => {
  const [busqueda, setBusqueda] = useState('');
  const [tipos, setTipos] = useState(['Todos']);
  const [rangoFiltro, setRangoFiltro] = useState({ start: null, end: null });
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  const { eventosPorTipo, loadingPorTipo } = useBuscaEventos(tipos);
  const { eventosPorNombre, loadingPorNombre } = useBuscaEventosPorNombre(busqueda);
  
  const [eventosFiltrados, setEventosFiltrados] = useState([]);
  const [tiposUnicos, setTiposUnicos] = useState(['Todos']);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const tipos = await obtenerTiposUnicos();
        setTiposUnicos(tipos);
      } catch (err) {
        console.error("Error al cargar tipos:", err);
      }
    };

    fetchTipos();
  }, []);

  useEffect(() => {
    const cargarEventosRango = async () => {
      if (!rangoFiltro.start || !rangoFiltro.end) return;

      const fechaIni = rangoFiltro.start.toISOString().split("T")[0];
      const fechaFin = rangoFiltro.end.toISOString().split("T")[0];

      const datos = await obtenerEventosPorRango(fechaIni, fechaFin);

      setEventosFiltrados(datos);
    };

    cargarEventosRango();
  }, [rangoFiltro]);

  useEffect(() => {
    if (rangoFiltro.start && rangoFiltro.end) return; // esto por que no podemos hacer el doble filtro ambos se cogen de todos no de los que estan en pantalla cambiarlo para mas adelante

    if (!loadingPorTipo && !loadingPorNombre) {

      if (busqueda.trim()) {
        const idsFiltradosPorNombre = eventosPorNombre.map(evento => evento.id);

        const eventos2Filtrados = eventosPorTipo.filter((evento) =>
          idsFiltradosPorNombre.includes(evento.id) // Aseguramos que el punto esté en los resultados por nombre
        );
        
        setEventosFiltrados(eventos2Filtrados);
      } else {
        setEventosFiltrados(eventosPorTipo);
      }
    }
  }, [loadingPorTipo, loadingPorNombre, eventosPorTipo, eventosPorNombre, busqueda, tipos]);

  const handleBusqueda = (text) => {
    setBusqueda(text); 
  };

  const toggleCategoria = (cat) => {
    setTipos((prev) => {
      let nuevosActivos;

      if (prev.includes(cat)) {
        nuevosActivos = prev.filter((c) => c !== cat);

        if (nuevosActivos.length === 0) {
          nuevosActivos = ['Todos'];
        }
      } else if (cat === 'Todos') {
        nuevosActivos = ['Todos'];
      } else {
        nuevosActivos = prev.includes('Todos') ? [cat] : [...prev, cat];
      }
      
      return nuevosActivos;
    });
  };

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


  const anchoBoton = Math.min(Dimensions.get('window').width / 4.5, 90);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Eventos</Text>
      <Text style={styles.subtitulo}>Descubre eventos cerca de ti</Text>

      <View style={styles.buscadorContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={{ marginRight: 6 }} />
        <TextInput
          placeholder="Buscar eventos..."
          value={busqueda}
          onChangeText={handleBusqueda}
          style={styles.inputBusqueda}
          placeholderTextColor="#999"
        />

        <TouchableOpacity onPress={() => setMostrarCalendario(true)}>
          <Ionicons name="calendar-outline" size={22} color="#666" style={{ marginHorizontal: 6 }} />
        </TouchableOpacity>

        <Modal
          visible={mostrarCalendario}
          transparent={true}
          animationType="slide"
        >
          <MiSelectorRango
            visible={mostrarCalendario}
            onClose={() => setMostrarCalendario(false)}
            onChangeRange={(rango) => setRangoFiltro(rango)}
          />
        </Modal>

        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <View style={{ height: 50, marginBottom: 12 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', paddingRight: 10 }}
        >
          {tiposUnicos.map(tipo => (
            <TouchableOpacity
              key={tipo}
              style={[
                styles.filtro,
                { width: anchoBoton },
                tipos.includes(tipo) && styles.filtroActivo
              ]}
              onPress={() => toggleCategoria(tipo)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filtroTexto,
                  tipos.includes(tipo) && styles.filtroTextoActivo
                ]}
                numberOfLines={1}
              >
                {tipo}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

        {loadingPorTipo || loadingPorNombre ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
            <ActivityIndicator size="large" color="#ff6347" />
            <Text style={{ marginTop: 10, color: '#666' }}>Cargando eventos...</Text>
          </View>
        ) : eventosFiltrados.length === 0 ? (
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