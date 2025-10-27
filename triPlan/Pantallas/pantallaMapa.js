import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import Mapa from "../mapa"; 
import Layout from '../Componentes/layout';
import BottomSheet from '../Componentes/BottomSheet'; 
import { useBuscaPuntos } from "../Funcionalidades/busquedaPuntos";

const imagenUbicacion = require("../assets/simboloUbicacion.png");
const ubicaciones = [
  { id: "1", titulo: "Ubicación 1", coordenadas: "17.213, 213.21" },
  { id: "2", titulo: "Ubicación 2 con palabra muy larga si es larga", coordenadas: "37.213, 2.21" },
  { id: "3", titulo: "Ubicación 3", coordenadas: "15.532, 210.45" },
  { id: "4", titulo: "Ubicación 4 cerca del centro", coordenadas: "18.221, 200.91" },
  { id: "5", titulo: "Ubicación 5", coordenadas: "19.121, 205.77" },
  { id: "6", titulo: "Ubicación 6 norte", coordenadas: "16.987, 211.34" },
  { id: "7", titulo: "Ubicación 7 sur", coordenadas: "14.653, 207.18" },
  { id: "8", titulo: "Ubicación 8 en zona rural", coordenadas: "20.121, 215.76" },
  { id: "9", titulo: "Ubicación 9 con nombre largo de ejemplo para probar texto largo", coordenadas: "22.553, 219.21" },
  { id: "10", titulo: "Ubicación 10 final", coordenadas: "25.001, 223.44" }
];

export default function PantallaMapa({ navigation }) {
  const [search, setSearch] = useState("");
  const [filteredUbis, setFilteredUbis] = useState(ubicaciones);

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
        <Text style={styles.coordenadas}>{item.coordenadas}</Text>
      </View>
    </View>
  );
  
  const { puntos, loading, error } = useBuscaPuntos();

  return (
    <Layout navigation={navigation}>
      <View style={styles.container}>
        <Mapa />
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
            data={puntos}  // aquí usas los puntos traídos del hook
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        )}
        <FlatList
          data={filteredUbis}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
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
