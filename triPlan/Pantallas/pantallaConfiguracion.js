import Layout from '../Componentes/layout';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function PantallaConfiguracion({ navigation }) {
  return (
    <Layout navigation={navigation}>
      <View style={styles.container}>
        <Pressable 
          style={styles.boton}        
          onPress={() => navigation.navigate('Login')}>
          <Text>Inicia sesion</Text>
        </Pressable>
        <Pressable 
          style={styles.boton}
                    onPress={() => navigation.navigate('Register')}>
          <Text>Registrar</Text>
        </Pressable>
        <Pressable 
          style={styles.boton}
          onPress={() => navigation.navigate('Password change')}>
          <Text>Cambiar contraseña</Text>
        </Pressable>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 10,
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
  boton: {
    margin: 10,
    padding: 10,
    borderRadius: 20,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  }
});
