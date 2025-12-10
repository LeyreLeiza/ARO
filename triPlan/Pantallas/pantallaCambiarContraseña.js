import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform 
} from "react-native";
import { cambioContraseñaUsuario } from "../Funcionalidades/busquedaUsuarios";
import { SafeAreaView } from "react-native-safe-area-context";

// 🔹 Importamos el hook para acceder al tamaño de letra
import { useFontSize } from '../Componentes/FontSizeContext'; 

// Aseguramos que la variable global exista (manteniendo solo idUsuario, ya que el tamaño de letra se mueve al Context)
global.idUsuario = global.idUsuario || "";

export default function ChangePasswordScreen({ navigation }) {
  // 🔹 Obtenemos el modificador de tamaño de letra del contexto
  const { fontSizeMod } = useFontSize(); 

  const [vieja_contraseña, setViejaContraseña] = useState("");
  const [nueva_contraseña, setNuevaContraseña] = useState("");
  const nuevaContraseñaRef = useRef();

  // NOTA: Se recomienda usar una modal o mensaje flotante en lugar de Alert para mejorar la UX.
  const handleCambioContraseña = async () => {
    if (!vieja_contraseña.trim()){
      Alert.alert("Campos obligatorios", "Por favor rellene la contraseña anterior");
      return;
    }
    if (!nueva_contraseña.trim()){
      Alert.alert("Campos obligatorios", "Por favor rellene la nueva contraseña");
      return;
    }
    const result = await cambioContraseñaUsuario(global.idUsuario, nueva_contraseña, vieja_contraseña);
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
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.botonVolver} onPress={volver}>
            {/* 🔹 Aplicamos fontSizeMod */}
            <Text style={[styles.textoVolver, { fontSize: 22 + fontSizeMod }]}>←</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            {/* 🔹 Aplicamos fontSizeMod */}
            <Text style={[styles.title, { fontSize: 40 + fontSizeMod }]}>Cambiar contraseña</Text>
            <View style={styles.linea}></View>
          </View>

          <View style={styles.content}>
            <Image 
              // Asegúrate de que esta ruta sea correcta
              source={require("../assets/fotoPerfil.png")} 
              style={styles.image} 
            />

            <TextInput
              // 🔹 Aplicamos fontSizeMod
              style={[styles.input, { fontSize: 16 + fontSizeMod }]}
              placeholder="Contraseña anterior"
              value={vieja_contraseña}
              onChangeText={setViejaContraseña}
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => nuevaContraseñaRef.current.focus()}
            />
            <TextInput
              // 🔹 Aplicamos fontSizeMod
              style={[styles.input, { fontSize: 16 + fontSizeMod }]}
              ref={nuevaContraseñaRef}
              placeholder="Contraseña nueva"
              value={nueva_contraseña}
              onChangeText={setNuevaContraseña}
              secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleCambioContraseña}>
              {/* 🔹 Aplicamos fontSizeMod */}
              <Text style={[styles.buttonText, { fontSize: 24 + fontSizeMod }]}>Cambiar</Text>
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
    text: '#000000ff',
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
    zIndex: 10, // Para asegurar que esté por encima de otros elementos
  },
  textoVolver: { color: "#fff", fontWeight: "600" },
});