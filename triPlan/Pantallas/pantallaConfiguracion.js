import React, { useState, useEffect } from 'react';
import Layout from '../Componentes/layout';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

// 🔹 Variables globales compartidas
global.usuarioLogueado = global.usuarioLogueado || false;
global.nombreUsuario = global.nombreUsuario || "";
global.idUsuario = global.idUsuario || "";
global.modLetraValor = global.modLetraValor || 0; // Tamaño de letra global

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
  const [estadoUsuario, setEstadoUsuario] = useState(global.usuarioLogueado);
  const [nombre, setNombre] = useState(global.nombreUsuario);

  // 🔹 Estado local para tamaño de letra
  const [modLetraValor, setModLetraValor] = useState(global.modLetraValor);

  const baseSizes = { login: 20, register: 20, password: 20, cerrar: 20 };

  // 🔹 Refresca datos de usuario cada medio segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setEstadoUsuario(global.usuarioLogueado);
      setNombre(global.nombreUsuario);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Función para actualizar tamaño de letra
  const cambiarTamanioLetra = (valor) => {
    global.modLetraValor = valor;   // actualizamos global
    setModLetraValor(valor);        // actualizamos estado local para re-render
  };

  return (
    <Layout navigation={navigation}>
      <View style={styles.container}>
        {/* 🔹 Botones si NO está logueado */}
        {!estadoUsuario && (
          <>
            <BotonPersonalizado
              texto="Iniciar sesión"
              color="#4A90E2"
              onPress={() => navigation.navigate('Login')}
              icono="sign-in-alt"
              fontSize={baseSizes.login + modLetraValor}
            />

            <BotonPersonalizado
              texto="Registrar"
              color="#4cd2b5ff"
              onPress={() => navigation.navigate('Register')}
              icono="user-plus"
              fontSize={baseSizes.register + modLetraValor}
            />
          </>
        )}

        {/* 🔹 Botones si está logueado */}
        {estadoUsuario && (
          <>
            <View style={styles.saludoBox}>
              <Text style={[styles.saludoTexto, { fontSize: 16 + modLetraValor }]}>
                Hola: <Text style={{ fontWeight: 'bold', color: '#1e3a8a' }}>{nombre}</Text>
              </Text>
            </View>

            {/* 🔹 Botón Cambiar contraseña */}
            <BotonPersonalizado
              texto="Cambiar contraseña"
              color="#eba01eff"
              onPress={() => navigation.navigate('Password change')}
              icono="lock"
              fontSize={baseSizes.password + modLetraValor}
            />

            {/* 🔹 Botón Cerrar sesión */}
            <TouchableOpacity
              style={[styles.boton, { backgroundColor: '#d9534f' }]}
              onPress={() => {
                global.usuarioLogueado = false;
                global.nombreUsuario = "";
                setEstadoUsuario(false);
                setNombre("");
                alert("Sesión cerrada");
              }}
            >
              <Text style={[styles.textoBoton, { fontSize: baseSizes.cerrar + modLetraValor }]}>
                Cerrar sesión
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* 🔹 Selector de tamaño de letra */}
        <View style={styles.selectorContainer}>
          <View style={styles.selectorBox}>
            <Text style={[styles.selectorTitle, { fontSize: 18 + modLetraValor }]}>
              Selecciona tamaño de letra:
            </Text>

            <View style={styles.selectorButtons}>
              <TouchableOpacity
                style={[styles.selectorButton, modLetraValor === -4 && styles.selectedButton]}
                onPress={() => cambiarTamanioLetra(-4)}
              >
                <Text style={[styles.selectorText, { fontSize: 14 + modLetraValor }]}>Pequeño</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.selectorButton, modLetraValor === 0 && styles.selectedButton]}
                onPress={() => cambiarTamanioLetra(0)}
              >
                <Text style={[styles.selectorText, { fontSize: 14 + modLetraValor }]}>Medio</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.selectorButton, modLetraValor === 4 && styles.selectedButton]}
                onPress={() => cambiarTamanioLetra(4)}
              >
                <Text style={[styles.selectorText, { fontSize: 14 + modLetraValor }]}>Grande</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f0f0' },
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
  selectorTitle: { fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  selectorButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  selectorButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  selectedButton: { backgroundColor: '#4caf50' },
  selectorText: { fontWeight: 'bold', color: '#333' },
  saludoBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
  },
  saludoTexto: { color: '#333' },
});
