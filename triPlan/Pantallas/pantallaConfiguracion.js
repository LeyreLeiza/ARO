import React from 'react';
import Layout from '../Componentes/layout';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import useModLetra from '../modLetra'; 

// Botón personalizado reutilizable
function BotonPersonalizado({ texto, color, onPress, icono, fontSize }) {
  return (
    <TouchableOpacity
      style={[styles.boton, { backgroundColor: color }]}
      onPress={onPress}
    >
      <View style={styles.contenidoBoton}>
        {icono && <FontAwesome5 name={icono} size={20} color="white" style={{ marginRight: 10 }} />}
        <Text style={[styles.textoBoton, { fontSize }]}>{texto}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function PantallaConfiguracion({ navigation }) {
  const [modLetra, updateModLetra] = useModLetra();

  // Tamaños base de los botones
  const baseSizes = { login: 20, register: 20, password: 20 };

  return (
    <Layout navigation={navigation}>
      <View style={styles.container}>
        {/* Botones principales */}
        <BotonPersonalizado
          texto="Iniciar sesión"
          color="#4A90E2"
          onPress={() => navigation.navigate('Login')}
          icono="sign-in-alt"
          fontSize={baseSizes.login + modLetra}
        />

        <BotonPersonalizado
          texto="Registrar"
          color="#4cd2b5ff"
          onPress={() => navigation.navigate('Register')}
          icono="user-plus"
          fontSize={baseSizes.register + modLetra}
        />

        <BotonPersonalizado
          texto="Cambiar contraseña"
          color="#eba01eff"
          onPress={() => navigation.navigate('Password change')}
          icono="lock"
          fontSize={baseSizes.password + modLetra}
        />

        {/* Selector de tamaño de letra dentro de un recuadro */}
        <View style={styles.selectorContainer}>
          <View style={styles.selectorBox}>
            {/* Frase incluida dentro del recuadro */}
            <Text style={styles.selectorTitle}>Selecciona tamaño de letra:</Text>
            
            <View style={styles.selectorButtons}>
              <TouchableOpacity
                style={[styles.selectorButton, modLetra === -4 && styles.selectedButton]}
                onPress={() => updateModLetra(-4)}
              >
                <Text style={styles.selectorText}>Pequeño</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.selectorButton, modLetra === 0 && styles.selectedButton]}
                onPress={() => updateModLetra(0)}
              >
                <Text style={styles.selectorText}>Medio</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.selectorButton, modLetra === 4 && styles.selectedButton]}
                onPress={() => updateModLetra(4)}
              >
                <Text style={styles.selectorText}>Grande</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  contenidoBoton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  textoBoton: { color: 'white', fontWeight: 'bold' },

  selectorContainer: { marginTop: 30, alignItems: 'center', width: '100%' },
  selectorBox: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  selectorTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  selectorButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  selectorButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: '#4caf50',
  },
  selectorText: {
    fontWeight: 'bold',
    color: '#333',
  },
});
