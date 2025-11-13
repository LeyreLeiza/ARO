import React, { useState, useRef } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { loginUsuario } from "../Funcionalidades/busquedaUsuarios";
import { SafeAreaView } from "react-native-safe-area-context";

// 🔹 Aseguramos que la variable global exista
global.usuarioLogueado = global.usuarioLogueado || false;
global.idUsuario = global.idUsuario || "";
global.modLetraValor = global.modLetraValor || 0; // Tamaño de letra global

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const contraseñaRef = useRef();

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Campos obligatorios", "Por favor rellene el email");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Campos obligatorios", "Por favor rellene la contraseña");
      return;
    }

    const result = await loginUsuario(email, password);

    if (result.success) {
      // 🔹 Guardar el estado global del usuario
      global.usuarioLogueado = true;
      global.nombreUsuario = result.data.nombre;
      global.idUsuario = result.data.id;


      Alert.alert("Éxito", `Bienvenido, ${result.data.nombre}`);
      navigation.goBack();
    } else {
      Alert.alert("Error", result.error);
    }
  };

  const volver = () => navigation.goBack();

  const modLetra = global.modLetraValor;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#eef2f7" }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.botonVolver} onPress={volver}>
            <Text style={[styles.textoVolver, { fontSize: 22 + modLetra }]}>←</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[styles.title, { fontSize: 40 + modLetra }]}>Inicia sesión</Text>
            <View style={styles.linea}></View>
          </View>

          <View style={styles.content}>
            <Image source={require("../assets/fotoPerfil.png")} style={styles.image} />
            <TextInput
              style={[styles.input, { fontSize: 16 + modLetra }]}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => contraseñaRef.current.focus()}
            />
            <TextInput
              style={[styles.input, { fontSize: 16 + modLetra }]}
              ref={contraseñaRef}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={[styles.buttonText, { fontSize: 24 + modLetra }]}>Acceder</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: 130, marginBottom: 40, alignItems: "flex-start" },
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
    marginBottom: 40,
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
