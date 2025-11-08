import React, { useState, useRef } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { registrarUsuario } from "../Funcionalidades/busquedaUsuarios";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register({ navigation }) {
  const [nombre_usuario, setNombreUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contraseña, setContraseña] = useState("");

  const scrollRef = useRef();
  const nombreRef = useRef();
  const apellidoRef = useRef();
  const emailRef = useRef();
  const telefonoRef = useRef();
  const contraseñaRef = useRef();


  const handleCrearCuenta = async () => {
    console.log(nombre_usuario, nombre, apellido, email, telefono, contraseña);
    if (!nombre_usuario.trim() || !nombre.trim() || !apellido.trim() || !email.trim() || !telefono.trim() || !contraseña.trim()) {
      Alert.alert("Campos obligatorios", "Por favor completa todos los campos");
      return;
    }

    try {
        const data = await registrarUsuario({ nombre_usuario, nombre, apellido, email, telefono, contraseña });
        Alert.alert("Éxito", `Cuenta creada para ${nombre_usuario}`);
        navigation.goBack();
    } catch (err) {
        Alert.alert("Error", err.message || "No se pudo conectar con el servidor");
    }
  };

  const volver = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#eef2f7" }}>
        <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
        <ScrollView
            ref={scrollRef}
            contentContainerStyle={{ flexGrow: 1, padding: 20, backgroundColor: "#eef2f7" }}
            keyboardShouldPersistTaps="handled"
        >
            <TouchableOpacity style={styles.botonVolver} onPress={volver}>
            <Text style={styles.textoVolver}>←</Text>
            </TouchableOpacity>

            <View style={styles.header}>
            <Text style={styles.title}>Crear Cuenta</Text>
            <View style={styles.linea}></View>
            </View>

            <View style={styles.content}>
            <Image source={require("../assets/fotoPerfil.png")} style={styles.image} />

            <TextInput
                style={styles.input}
                placeholder="Nombre de usuario"
                value={nombre_usuario}
                onChangeText={setNombreUsuario}
                returnKeyType="next"
                onSubmitEditing={() => nombreRef.current.focus()}
            />
            <TextInput
                style={styles.input}
                ref={nombreRef}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
                returnKeyType="next"
                onSubmitEditing={() => apellidoRef.current.focus()}
            />
            <TextInput
                style={styles.input}
                ref={apellidoRef}
                placeholder="Apellido"
                value={apellido}
                onChangeText={setApellido}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current.focus()}

            />
            <TextInput
                style={styles.input}
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
                style={styles.input}
                ref={telefonoRef}
                placeholder="Teléfono"
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => contraseñaRef.current.focus()}
            />

            <TextInput
                style={[styles.input, { flex: 1 }]}
                ref={contraseñaRef}
                placeholder="Contraseña"
                value={contraseña}
                onChangeText={setContraseña}
                secureTextEntry
                returnKeyType="done"
            />

            <TouchableOpacity style={styles.button} onPress={handleCrearCuenta}>
                <Text style={styles.buttonText}>Crear Cuenta</Text>
            </TouchableOpacity>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 100,
    marginBottom: 40,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    color: "#1e3a8a",
  },
  linea: {
    width: 80,
    height: 4,
    backgroundColor: "#1e3a8a",
    borderRadius: 2,
    marginTop: 8,
  },
  content: {
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 60,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  toggleText: {
    color: "#1e3a8a",
    fontWeight: "bold",
    paddingHorizontal: 10,
    fontSize: 16,
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
  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  botonVolver: {
    position: "absolute",
    top: 60,
    left: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#1e3a8a",
    borderRadius: 8,
  },
  textoVolver: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },
});
