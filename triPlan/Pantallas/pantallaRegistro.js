import React, { useState, useRef } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { registrarUsuario } from "../Funcionalidades/busquedaUsuarios";
import { SafeAreaView } from "react-native-safe-area-context";

// 🔹 Aseguramos que la variable global exista
global.usuarioLogueado = global.usuarioLogueado || false;
global.idUsuario = global.idUsuario || "";
global.modLetraValor = global.modLetraValor || 0; // Tamaño de letra global

export default function Register({ navigation }) {
  const [nombre_usuario, setNombreUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contraseña, setContraseña] = useState("");

  const nombreRef = useRef();
  const apellidoRef = useRef();
  const emailRef = useRef();
  const telefonoRef = useRef();
  const contraseñaRef = useRef();

  const handleCrearCuenta = async () => {
    if (!nombre_usuario.trim() || !nombre.trim() || !apellido.trim() || !email.trim() || !telefono.trim() || !contraseña.trim()) {
      Alert.alert("Campos obligatorios", "Por favor completa todos los campos");
      return;
    }

    try {
      const data = await registrarUsuario({
        nombre_usuario,
        nombre,
        apellido,
        email,
        telefono,
        contraseña,
      });

      // 🔹 Guardar el estado global del usuario
      global.usuarioLogueado = true;
      global.idUsuario = data.usuario.id;
      global.nombreUsuario = nombre_usuario;

      Alert.alert("Éxito", `Cuenta creada para ${nombre_usuario}`);
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.message || "No se pudo conectar con el servidor");
    }
  };

  const volver = () => navigation.goBack();

  // 🔹 Tamaño de letra global
  const modLetra = global.modLetraValor;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#eef2f7" }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, backgroundColor: "#eef2f7" }} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.botonVolver} onPress={volver}>
            <Text style={[styles.textoVolver, { fontSize: 22 + modLetra }]}>←</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[styles.title, { fontSize: 40 + modLetra }]}>Crear Cuenta</Text>
            <View style={styles.linea}></View>
          </View>

          <View style={styles.content}>
            <Image source={require("../assets/fotoPerfil.png")} style={styles.image} />

            <TextInput
              style={[styles.input, { fontSize: 16 + modLetra }]}
              placeholder="Nombre de usuario"
              value={nombre_usuario}
              onChangeText={setNombreUsuario}
              returnKeyType="next"
              onSubmitEditing={() => nombreRef.current.focus()}
            />
            <TextInput
              style={[styles.input, { fontSize: 16 + modLetra }]}
              ref={nombreRef}
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
              returnKeyType="next"
              onSubmitEditing={() => apellidoRef.current.focus()}
            />
            <TextInput
              style={[styles.input, { fontSize: 16 + modLetra }]}
              ref={apellidoRef}
              placeholder="Apellido"
              value={apellido}
              onChangeText={setApellido}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current.focus()}
            />
            <TextInput
              style={[styles.input, { fontSize: 16 + modLetra }]}
              ref={emailRef}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => telefonoRef.current.focus()}
            />
            <TextInput
              style={[styles.input, { fontSize: 16 + modLetra }]}
              ref={telefonoRef}
              placeholder="Teléfono"
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
              returnKeyType="next"
              onSubmitEditing={() => contraseñaRef.current.focus()}
            />
            <TextInput
              style={[styles.input, { fontSize: 16 + modLetra }]}
              ref={contraseñaRef}
              placeholder="Contraseña"
              value={contraseña}
              onChangeText={setContraseña}
              secureTextEntry
              returnKeyType="done"
            />

            <TouchableOpacity style={styles.button} onPress={handleCrearCuenta}>
              <Text style={[styles.buttonText, { fontSize: 24 + modLetra }]}>Crear Cuenta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: 100, marginBottom: 40, alignItems: "flex-start" },
  title: { fontWeight: "800", color: "#1e3a8a" },
  linea: { width: 80, height: 4, backgroundColor: "#1e3a8a", borderRadius: 2, marginTop: 8 },
  content: { alignItems: "center" },
  image: { width: 200, height: 200, borderRadius: 60, marginBottom: 30 },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  button: {
    backgroundColor: "#1e3a8a",
    width: "50%",
    height: 70,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  botonVolver: {
    position: "absolute",
    top: 60,
    left: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#1e3a8a",
    borderRadius: 8,
  },
  textoVolver: { color: "#fff", fontWeight: "600" },
});
