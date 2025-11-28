import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions, Modal, Pressable  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBuscaEventos, useBuscaEventosPorNombre, obtenerTiposUnicos, obtenerEventosPorRango, añadirEventoFavorito, eliminarEventoFavorito, obtenerEventosFavoritos } from '../Funcionalidades/busquedaEventos';
import MiSelectorRango from '../Componentes/calendario';

const PantallaEventos = ({ navigation }) => {
  const [busqueda, setBusqueda] = useState('');
  const [tipos, setTipos] = useState(['Todos']);
  const [rangoFiltro, setRangoFiltro] = useState({ start: null, end: null });
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [favoritos, setFavoritos] = useState([]);

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
    if (!loadingPorTipo && !loadingPorNombre) {

      const aplicarFiltros = async () => { 
        let lista = eventosPorTipo;        

        if (busqueda.trim()) {
          const idsPorNombre = eventosPorNombre.map(e => e.id);
          lista = lista.filter(e => idsPorNombre.includes(e.id));
        }

        if (rangoFiltro.start && rangoFiltro.end) {
          const fechaIni = rangoFiltro.start.toISOString().split("T")[0];
          const fechaFin = rangoFiltro.end.toISOString().split("T")[0];

          try {
            const eventosRango = await obtenerEventosPorRango(fechaIni, fechaFin);
            console.log("DEBUG - obtenerEventosPorRango() devolvió:", eventosRango);

            const idsRango = Array.isArray(eventosRango) 
              ? eventosRango.map(e => e.id) 
              : [];

            lista = lista.filter(e => idsRango.includes(e.id));

          } catch (error) {
            console.error("Error al obtener eventos por rango:", error);
          }
        }

        if (!tipos.includes("Todos")) {
          lista = lista.filter(e => tipos.includes(e.tipo));
        }

        setEventosFiltrados(lista);
      };

      aplicarFiltros(); 
    }

  }, [ loadingPorTipo, loadingPorNombre, eventosPorTipo, eventosPorNombre, busqueda, tipos, rangoFiltro ]
  );

  useEffect(() => {
    const cargarFavoritos = async () => {
      if (!global.usuarioLogueado) return;

      const ids = await obtenerEventosFavoritos(global.idUsuario);
      setFavoritos(ids);
    };

    cargarFavoritos();
  }, [global.usuarioLogueado]);

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

  const renderEvento = ({ item }) => {
    const esFavorito = favoritos.includes(item.id);
    return(
      <TouchableOpacity 
        onPress={() => navigation.navigate('DetalleEvento', { evento: item })} 
        activeOpacity={0.8}
      >
        <View style={styles.card}>
          {item.imagen ? (
            <Image source={{ uri: item.imagen }} style={styles.imagen} />
          ) : (
            <View style={[styles.imagen, styles.imagenPlaceholder]}>
              <Ionicons name="image-outline" size={40} color="#888" />
            </View>
          )}
          <Pressable
            style={styles.iconoFavorito}
            onPress={async (e) => {
              console.log("Se ha hecho click en el corazon");

              if (!global.usuarioLogueado) {
                alert("Debes iniciar sesión para guardar favoritos");
                return;
              }

              const usuario_id = global.idUsuario;
              const evento_id = item.id;
              const esFavorito = favoritos.includes(evento_id);
              console.log(esFavorito);
              console.log(usuario_id);
              console.log(evento_id);
              let ok = false;

              if (esFavorito) {
                console.log("Se elimina evento");
                ok = await eliminarEventoFavorito(usuario_id, evento_id);
              } else {
                console.log("Se añade evento");
                ok = await añadirEventoFavorito(usuario_id, evento_id);
                console.log("Termina");
              }

              if (ok) {
                setFavoritos(prev =>
                  esFavorito
                    ? prev.filter(id => id !== evento_id)
                    : [...prev, evento_id]
                );
              } else {
                alert("No se pudo actualizar favorito");
              }
            }}
          >
            <Ionicons
              name={esFavorito ? "heart" : "heart-outline"}
              size={22}
              color={esFavorito ? "gold" : "#000"}
            />
          </Pressable>
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
      </TouchableOpacity>
    )
  };

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

          {rangoFiltro.start && rangoFiltro.end && (
            <View style={styles.filtroRangoActivo}>
              <Text style={styles.filtroRangoTexto}>
                {rangoFiltro.start.toLocaleDateString()} → {rangoFiltro.end.toLocaleDateString()}
              </Text>

              <TouchableOpacity onPress={() => setRangoFiltro({ start: null, end: null })}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          )}

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
            extraData={favoritos}
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
  filtroRangoActivo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
    marginLeft: 4,
  },

  filtroRangoTexto: {
    color: '#333 ',
    fontWeight: '600',
    marginRight: 6,
  },
});

export default PantallaEventos;