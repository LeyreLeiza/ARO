import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Mapa from "../mapa"; 
import Layout from '../Componentes/layout';
import BottomSheet from '../Componentes/BottomSheet'; // 👈 añadimos el BottomSheet

export default function SegundaPantalla({ navigation }) {
  return (
    <Layout navigation={navigation}>
      <Text style={styles.text}>¡Esta es la segunda pantalla!</Text>
      <Button
        title="Volver a la pantalla principal"
        onPress={() => navigation.goBack()} 
      />

      <View style={styles.container}>
        <Text style={styles.title}>Mapa</Text>
        <Mapa />
      </View>

      {/* 👇 Aquí aparece el botón deslizable */}
      <BottomSheet />
    </Layout>
  );
}

const styles = StyleSheet.create({
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  container: {
    flex: 1,
    paddding: 16,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  }, 
});
