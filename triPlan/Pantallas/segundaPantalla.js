// screens/SecondScreen.js
import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Mapa from "../mapa"; 

export default function SecondScreen({ navigation }) {
    const insets = useSafeAreaInsets();  // Usamos el hook para obtener los márgenes seguros

  return (
    
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>¡Esta es la segunda pantalla!</Text>
      <Button
        title="Volver a la pantalla principal"
        onPress={() => navigation.goBack()}  // Esto regresa a la pantalla anterior
      />
      

<View style={styles.container}>
      <Text style={styles.title}>Mapa</Text>
      <Mapa />
    </View>
      {/* Barra inferior */}
            <View style={[styles.bottomBar, { bottom: insets.bottom }]}>
              <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.buttonText2}>Opción 1</Text>
              </TouchableOpacity>
      
              <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('Second')}>
                <Text style={styles.buttonText2}>Opción 2</Text>
              </TouchableOpacity>
      
              <TouchableOpacity style={styles.button2} onPress={() => alert('Opción 3')}>
                <Text style={styles.buttonText2}>Opción 3</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button2} onPress={() => alert('Opción 4')}>
                <Text style={styles.buttonText2}>Opción 4</Text>
              </TouchableOpacity>
            </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
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
  bottomBar: {
    flexDirection: 'row', // Alinea los botones en una fila
    justifyContent: 'space-around', // Distribuye los botones equitativamente
    alignItems: 'center',
    width: '100%',
    height: 60,
    backgroundColor: '#f1f1f1',
    position: 'absolute', // Fija la barra en la parte inferior
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    zIndex: 999, // Asegura que la barra esté por encima de otros elementos
  },
  button2: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText2: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
