import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Mapa from "../mapa"; 
import Layout from '../Componentes/layout';
import BottomSheet from '../Componentes/BottomSheet'; 
import Busqueda from "../Pantallas/pantallaBusqueda"

const imagenUbicacion = require("../assets/simboloUbicacion.png");

export default function PantallaMapa({ navigation }) {
  return (
    <Layout navigation={navigation}>
      <View style={styles.container}>
        <Mapa />
      </View>
      <BottomSheet>
        <Busqueda/>
        <View style={styles.caja}>
          <Image 
            style={styles.imagenUbi}
            source={imagenUbicacion}
          />
          <View style={styles.textContainer}>
            <Text style={styles.titulo}>Ubicacion 1  </Text>
            <Text style={styles.coordenadas}>17.213, 213.21</Text>
          </View>
        </View>
        <View style={styles.caja}>
          <Image
            style={styles.imagenUbi}
            source={imagenUbicacion}
          />
          <View style={styles.textContainer}>
            <Text style={styles.titulo}>Ubicacion 2 con palabra muy larga si es larga </Text>
            <Text style={styles.coordenadas}>37.213, 2.21</Text>
          </View>        
        </View>
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
});
