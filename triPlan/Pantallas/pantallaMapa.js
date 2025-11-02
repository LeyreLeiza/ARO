import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Mapa from "../mapa"; 
import Layout from '../Componentes/layout';
import BottomSheet from '../Componentes/BottomSheet'; 
import { useBuscaPuntos } from "../Funcionalidades/busquedaPuntos";
import InformacionPunto from './pantallaEspecificacionPunto';
import ListaPuntos from "../Funcionalidades/listadoPuntos"


export default function PantallaMapa({ navigation }) {
  const [search, setSearch] = useState("");
  const [filteredUbis, setFilteredUbis] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]); 
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);


  const { puntos, loading, error } = useBuscaPuntos();

  useEffect(() => {
    // Solo ejecuta el mapeo cuando ya terminó de cargar
    if (!loading && puntos.length > 0) {
      const nuevasUbis = puntos.map((p) => ({
        id: p.id.toString(),
        titulo: p.nombre,
        lon: Number(p.longitud),
        lat: Number(p.latitud),
        tipo: p.tipo,
        descripcion: p.descripcion,
        imagen: p.imagen
      }));

      setUbicaciones(nuevasUbis);
      setFilteredUbis(nuevasUbis);
    } else if (!loading && puntos.length === 0) {
      console.log("No hay puntos disponibles");
    }
  }, [loading, puntos]);


  const normalizarTexto = (str) => {
    return str
      .normalize("NFD") // descompone los caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // elimina los acentos
      .toLowerCase(); // pasamos a minúsculas
  };

  const filtrarUbicaciones = (texto = search, categorias = activos) => {
    const results = ubicaciones.filter((item) => {
      const coincideTexto = normalizarTexto(item.titulo).includes(normalizarTexto(texto));

      const coincideCategoria = categorias.includes("Todos") || categorias.includes(item.tipo);
      return coincideTexto && coincideCategoria;
  });

    setFilteredUbis(results); 
  }

  const handleSearch = (text) => {
    setSearch(text); 
    filtrarUbicaciones(text, activos);
  };

  const [activos, setActivos] = useState(['Todos']);
  const categorias = ['Todos', 'Zonas', 'Monumentos', 'Edificios', 'Gastronomia', 'Zonas verdes', 'Arte', 'Deportes', 'Eventos'];
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
      
      filtrarUbicaciones(search, nuevosActivos);

      return nuevosActivos;
    });
  };


  return (
    <Layout navigation={navigation}>
      <View style={styles.container}>
        <Mapa ubicaciones={filteredUbis}/>
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
      <BottomSheet>
      {puntoSeleccionado ? (
      <InformacionPunto 
        punto={puntoSeleccionado} 
        onBack={() => setPuntoSeleccionado(null)} 
      />
      ) : (
        <ListaPuntos
          filteredUbis={filteredUbis}
          loading={loading}
          error={error}
          onSelect={(item) => setPuntoSeleccionado(item)}
        />
        )
      }
      </BottomSheet>
    </Layout>
)}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  caja: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imagenUbi: {
    width: 50,
    height: 50,
  },
  textContainer: {
    flexDirection: 'column',
    marginLeft: 15,
    flex: 1,
  },
  iconContainer: {
    marginTop: 10,
    marginRight: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flexWrap: 'wrap',
    overflowWrap: 'break-word',
  },
  tipo: {
    color: '#555',
    fontSize: 14,
  },
  descripcion: {
    fontSize: 12,
    color: '#777',
    margin: 10,
    textAlign: 'justify',
  },
  cajaBuscador: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    paddingLeft: 5,
    paddingRight: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center', 

    // Sombra iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Sombra Android
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
    color: '#7a7a7aff',
    fontWeight: '400',
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
    backgroundColor: '#f8f8f8', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  botonActivo: {
    backgroundColor: '#4a90e2', 
    borderColor: '#357ABD',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  textoBoton: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  textoBotonActivo: {
    color: '#fff',
    fontWeight: '700',
  },
  imagenBusqueda: {
    width: 40,
    height: 40,
    marginRight: 3,
  },
  icono: {
    marginLeft: 'auto', 
    alignSelf: 'center',
    color: '#ccc',
  },
});
