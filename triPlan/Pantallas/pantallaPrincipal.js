import React from 'react';
import { StyleSheet, Text, View, Pressable, Image} from 'react-native';
import Layout from '../Componentes/layout';

const icon = require('../assets/pamplona.jpeg');

export default function PantallaPrincipal({ navigation }) {
  return (
    <Layout navigation={navigation}>
      <View>
        <Text style={styles.title}>Bienvenido a la aplicación triPlan!</Text>
        <Image source={icon} style={styles.image} />
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('Segunda')}  
        >
          <Text style={styles.buttonText}>Iniciar</Text>
        </Pressable>
      </View>
    </Layout>

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
});
