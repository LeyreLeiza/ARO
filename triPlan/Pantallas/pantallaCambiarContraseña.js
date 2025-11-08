import React, { useState, useRef } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { cambioContraseñaUsuario } from "../Funcionalidades/busquedaUsuarios";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePasswordScreen({ navigation }) {
  const [vieja_contraseña, setViejaContraseña] = useState("");
  const [id, setId] = useState("");
  const [nueva_contraseña, setNuevaContraseña] = useState("");
  const nuevaContraseñaRef = useRef();

  const handleLogin = async () => {
    if (!id.trim()){
      Alert.alert("Campos obligatorios", "Por favor rellene el id de quien quieras cambiar, para borrar mas tarde");
      return;
    }
    if (!vieja_contraseña.trim()){
      Alert.alert("Campos obligatorios", "Por favor rellene la contraseña anterior");
      return;
    }
    if (!nueva_contraseña.trim()){
      Alert.alert("Campos obligatorios", "Por favor rellene la nueva contraseña");
      return;
    }
    const result = await cambioContraseñaUsuario(id, nueva_contraseña, vieja_contraseña);
    if (result.success) {
      Alert.alert("Éxito", "Contraseña cambiada");
      navigation.goBack();
    } else {
      Alert.alert("Error", result.error);
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
      >
        <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} // <- nuevo
          keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.botonVolver} onPress={volver}>
            <Text style={styles.textoVolver}>←</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Cambiar contraseña</Text>
            <View style={styles.linea}></View>
          </View>

          <View style={styles.content}>
            <Image source={require("../assets/fotoPerfil.png")} style={styles.image} />
            
            <TextInput
                style={[styles.input, { height: 90 }]}
                placeholder="ID (para borrar después se supone que cuando haya iniciado sesion guardaremos el id en algún lado)"
                value={id}
                onChangeText={setId}
                multiline={true}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña anterior"
              value={vieja_contraseña}
              onChangeText={setViejaContraseña}
              secureTextEntry
            returnKeyType="next"
              onSubmitEditing={() => nuevaContraseñaRef.current.focus()}
            />
            <TextInput
              style={styles.input}
              ref={nuevaContraseñaRef}
              placeholder="Contraseña nueva"
              value={nueva_contraseña}
              onChangeText={setNuevaContraseña}
              secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Cambiar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2f7",
    padding: 20,
  },
  header: {
    marginTop: 130,
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
