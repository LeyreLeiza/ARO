import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import Mapa from "../mapa"; 
import Layout from '../Componentes/layout';
import BottomSheet from '../Componentes/BottomSheet'; 
import { useBuscaPuntos } from "../Funcionalidades/busquedaPuntos";

const imagenUbicacion = require("../assets/simboloUbicacion.png");

export default function PantallaMapa({ navigation }) {
  const [search, setSearch] = useState("");
  const [filteredUbis, setFilteredUbis] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]); 

  const { puntos, loading, error } = useBuscaPuntos();

  useEffect(() => {
    // Solo ejecuta el mapeo cuando ya terminó de cargar
    if (!loading && puntos.length > 0) {
      const nuevasUbis = puntos.map((p) => ({
        id: p.id.toString(),
        titulo: p.nombre,
        lon: Number(p.lon),
        lat: Number(p.lat),
        tipo: p.tipo,
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

  const handleSearch = (text) => {
    setSearch(text); 

    const results = ubicaciones.filter((item) =>
      normalizarTexto(item.titulo).includes(normalizarTexto(text))
    );

    setFilteredUbis(results); 
  };

  const renderItem = ({ item }) => (
    <View style={styles.caja}>
      <Image style={styles.imagenUbi} source={imagenUbicacion} />
      <View style={styles.textContainer}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.coordenadas}>{item.tipo}</Text>
      </View>
    </View>
  );
    

  return (
    <Layout navigation={navigation}>
      <View style={styles.container}>
        <Mapa ubicaciones={filteredUbis}/>
        <View style={styles.cajaBuscador}>
          <Image style={styles.imagenBusqueda} source={require("../assets/searchIcon.png")} />
          <TextInput
            style={styles.input}
            value={search}
            onChangeText={handleSearch} 
            placeholder="Buscar ubicacion..."
          />
        </View>
      </View>
      <BottomSheet>
        {loading ? (
          <View style={{ padding: 10, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#333" />
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#333'}}>Cargando datos...</Text>
          </View>
        ) : error ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: 'red' }}>Error: {error}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredUbis} 
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
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
  caja: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    margin: 10,
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
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flexWrap: 'wrap',
    overflowWrap: 'break-word',
  },
  coordenadas: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
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
    flexDirection: 'row',
    alignItems: 'center', 

    // Sombra iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Sombra Android
    elevation: 5,
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
    fontWeight: '00',
    },
  imagenBusqueda: {
    width: 40,
    height: 40,
    marginRight: 3,
  },
});
