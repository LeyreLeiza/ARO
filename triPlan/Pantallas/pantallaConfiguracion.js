import React, { useState, useEffect } from 'react';
import Layout from '../Componentes/layout';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

// 🔹 1. IMPORTAR EL HOOK DEL CONTEXTO (IMPORTANTE)
// Asegúrate de que la ruta '../Context/FontSizeContext' sea correcta según tu estructura de carpetas
import { useFontSize } from '../Componentes/FontSizeContext';

// Variables globales (se mantienen por compatibilidad si las usas en otro lado fuera de React)
global.usuarioLogueado = global.usuarioLogueado || false;
global.nombreUsuario = global.nombreUsuario || "";
global.idUsuario = global.idUsuario || "";

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

  // 🔹 2. USAR EL HOOK DENTRO DEL COMPONENTE
  // Esto nos da acceso a la variable 'fontSizeMod' y a la función 'cambiarTamano'
  const { fontSizeMod, cambiarTamano } = useFontSize();

  const baseSizes = { login: 20, register: 20, password: 20, cerrar: 20 };

  // Refresca datos de usuario cada medio segundo (para login/logout)
  useEffect(() => {
    const interval = setInterval(() => {
      setEstadoUsuario(global.usuarioLogueado);
      setNombre(global.nombreUsuario);
    }, 500);
    return () => clearInterval(interval);
  }, []);

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
              // Usamos fontSizeMod del contexto
              fontSize={baseSizes.login + fontSizeMod} 
            />

            <BotonPersonalizado
              texto="Registrar"
              color="#4cd2b5ff"
              onPress={() => navigation.navigate('Register')}
              icono="user-plus"
              fontSize={baseSizes.register + fontSizeMod}
            />
          </>
        )}

        {/* 🔹 Botones si está logueado */}
        {estadoUsuario && (
          <>
            <View style={styles.saludoBox}>
              <Text style={[styles.saludoTexto, { fontSize: 16 + fontSizeMod }]}>
                Hola: <Text style={{ fontWeight: 'bold', color: '#1e3a8a' }}>{nombre}</Text>
              </Text>
            </View>

            {/* 🔹 Botón Cambiar contraseña */}
            <BotonPersonalizado
              texto="Cambiar contraseña"
              color="#eba01eff"
              onPress={() => navigation.navigate('Password change')}
              icono="lock"
              fontSize={baseSizes.password + fontSizeMod}
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
              <Text style={[styles.textoBoton, { fontSize: baseSizes.cerrar + fontSizeMod }]}>
                Cerrar sesión
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* 🔹 Selector de tamaño de letra */}
        <View style={styles.selectorContainer}>
          <View style={styles.selectorBox}>
            <Text style={[styles.selectorTitle, { fontSize: 18 + fontSizeMod }]}>
              Selecciona tamaño de letra:
            </Text>

            <View style={styles.selectorButtons}>
              <TouchableOpacity
                style={[styles.selectorButton, fontSizeMod === -4 && styles.selectedButton]}
                onPress={() => cambiarTamano(-4)} // 🔹 Usamos la función del contexto
              >
                <Text style={[styles.selectorText, { fontSize: 14 + fontSizeMod }]}>Pequeño</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.selectorButton, fontSizeMod === 0 && styles.selectedButton]}
                onPress={() => cambiarTamano(0)}
              >
                <Text style={[styles.selectorText, { fontSize: 14 + fontSizeMod }]}>Medio</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.selectorButton, fontSizeMod === 4 && styles.selectedButton]}
                onPress={() => cambiarTamano(4)}
              >
                <Text style={[styles.selectorText, { fontSize: 14 + fontSizeMod }]}>Grande</Text>
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