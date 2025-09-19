import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const icon = require('../assets/pamplona.jpeg');

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();  // Usamos el hook para obtener los márgenes seguros

  return (
    <SafeAreaView style={styles.container}>
      {/* El contenido principal de la pantalla */}
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Bienvenido a la aplicación triPlan!</Text>
        <Image source={icon} style={styles.image} />
        <TouchableHighlight
          style={styles.button}
          onPress={() => navigation.navigate('Second')}  // Navegar a la segunda pantalla
        >
          <Text style={styles.buttonText}>Iniciar</Text>
        </TouchableHighlight>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',  // Alineamos todo desde arriba (por defecto)
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'lightblue',
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 30,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 25,
    paddingHorizontal: 50,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    margin: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
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
