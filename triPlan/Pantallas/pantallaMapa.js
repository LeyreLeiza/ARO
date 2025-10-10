import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Mapa from "../mapa"; 
import Layout from '../Componentes/layout';
import BottomSheet from '../Componentes/BottomSheet'; 

export default function PantallaMapa({ navigation }) {
  return (
    <Layout navigation={navigation}>
      <View style={styles.container}>
        <Mapa />
      </View>

      <BottomSheet />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },

});
