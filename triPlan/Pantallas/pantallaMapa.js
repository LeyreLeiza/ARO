import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, FlatList, ActivityIndicator, Pressable } from 'react-native';
import Mapa from "../mapa"; 
import Layout from '../Componentes/layout';
import BottomSheet from '../Componentes/BottomSheet'; 
import { useBuscaPuntos } from "../Funcionalidades/busquedaPuntos";
import { Ionicons } from '@expo/vector-icons'; // o el paquete que uses para íconos

const imagenUbicacion = require("../assets/simboloUbicacion.png");

export default function PantallaMapa({ navigation }) {
  const [search, setSearch] = useState("");
  const [filteredUbis, setFilteredUbis] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]); 
  const [itemAbierto, setItemAbierto] = useState([]);

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
        descripcion: p.descripcion ,
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
    <Pressable onPress={() => handlePress(item.id)}>
      <View style={styles.caja}>
        <View style={styles.row}>
          <Image style={styles.imagenUbi} source={imagenUbicacion} />
          <View style={styles.textContainer}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.tipo}>{item.tipo}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons
              name={itemAbierto.includes(item.id) ? 'chevron-up' : 'chevron-down'}
            style={styles.icono} size={25}
            />
          </View>
        </View>
      {itemAbierto.includes(item.id) && (
        <Text style={styles.descripcion}>{item.descripcion}</Text>
      )}
      </View>
    </Pressable>
  );
    
  const handlePress = (id) => {
  setItemAbierto((prev) =>
    prev.includes(id)
      ? prev.filter((itemId) => itemId !== id) 
      : [...prev, id] 
  );
};



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
    fontWeight: '400',
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
