import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Mapa from "../mapa"; 
import Layout from '../Componentes/layout';
import BottomSheet from '../Componentes/BottomSheet'; 
import { useBuscaPuntos, useBuscaPuntosPorNombre } from "../Funcionalidades/busquedaPuntos";
import InformacionPunto from './pantallaEspecificacionPunto';
import ListaPuntos from "../Funcionalidades/listadoPuntos";

export default function PantallaMapa({ navigation }) {
  const [search, setSearch] = useState("");
  const [activos, setActivos] = useState(['Todos']);
  const categorias = ['Todos', 'Zonas', 'Monumentos', 'Edificios', 'Gastronomia', 'Zonas verdes', 'Arte', 'Deportes', 'Eventos'];

  const [filteredUbis, setFilteredUbis] = useState([]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
 
  const { puntosPorTipo, loadingPorTipo, errorPorTipo } = useBuscaPuntos(activos);
  const { puntosPorNombre, loadingPorNombre, errorPorNombre } = useBuscaPuntosPorNombre(search); 
  
  useEffect(() => {
    if (!loadingPorTipo && !loadingPorNombre) {
      const listaTipo = puntosPorTipo || [];
      const listaNombre = puntosPorNombre || [];

      if (search.trim()) {
        const idsFiltradosPorNombre = listaNombre.map(p => p.id);
        const puntosFiltrados = listaTipo.filter(p => idsFiltradosPorNombre.includes(p.id));
        setFilteredUbis(puntosFiltrados);
      } else {
        setFilteredUbis(listaTipo);
      }
    }
  }, [loadingPorTipo, loadingPorNombre, puntosPorTipo, puntosPorNombre, search, activos]);

  const handleSearch = (text) => {
    setSearch(text); 
  };

  const toggleCategoria = (cat) => {
    setActivos((prev) => {
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

  return (
    <Layout navigation={navigation}>
      <View style={styles.container}>

        {/* MAPA */}
        <Mapa 
          ubicaciones={filteredUbis || []}
          onSelectPunto={(punto) => setPuntoSeleccionado(punto)}
        />

        {/* BUSCADOR */}
        <View style={styles.cajaBuscador}>
          <View style={styles.buscador}>
            <Image style={styles.imagenBusqueda} source={require("../assets/searchIcon.png")} />
            <TextInput
              style={styles.input}
              value={search}
              onChangeText={handleSearch} 
              placeholder="Buscar ubicacion..."
            />
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.scrollBotones}
            contentContainerStyle={{ alignItems: 'center' }}
          >
            {categorias.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => toggleCategoria(cat)}
                style={[styles.boton, activos.includes(cat) && styles.botonActivo]}
              >
                <Text style={[styles.textoBoton, activos.includes(cat) && styles.textoBotonActivo]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* BOTTOM SHEET */}
      <BottomSheet>
        {puntoSeleccionado ? (
          <InformacionPunto 
            punto={puntoSeleccionado} 
            onBack={() => setPuntoSeleccionado(null)} 
          />
        ) : (
          <ListaPuntos
            filteredUbis={filteredUbis || []}
            loading={loadingPorTipo || loadingPorNombre}
            error={errorPorTipo || errorPorNombre}
            onSelect={(item) => setPuntoSeleccionado(item)}
          />
        )}
      </BottomSheet>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  cajaBuscador: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  buscador: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#e8e8e8ff',
    fontSize: 16,
    marginRight: 10,      
    maxWidth: "85%",      
  },
  scrollBotones: {
    width: '100%',
    paddingVertical: 5,
  },
  boton: {
    margin: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
  },
  botonActivo: {
    backgroundColor: '#4a90e2',
    borderColor: '#357ABD',
  },
  textoBoton: {
    fontSize: 14,
  },
  textoBotonActivo: {
    color: '#fff',
    fontWeight: '700',
  },
  imagenBusqueda: {
    width: 40,
    height: 40,
    marginRight: 3,
  }
});
