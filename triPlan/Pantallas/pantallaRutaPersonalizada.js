import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBuscaPuntos } from "../Funcionalidades/busquedaPuntos";
import Icon from 'react-native-vector-icons/FontAwesome';
import { insertarRutaPersonalizada, actualizarRutaPersonalizada } from "../Funcionalidades/busquedaUsuarios";

global.idUsuario = global.idUsuario || "";
global.modLetraValor = global.modLetraValor || 0;

export default function RutaPersonalizada({ navigation, route }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [puntos, setPuntos] = useState([]);

  const [mostrarLista, setMostrarLista] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const descripcionRef = useRef();
  const volver = () => navigation.goBack();
  const modLetra = global.modLetraValor;
  const { puntosPorTipo, loadingPorTipo, error } = useBuscaPuntos(['Todos']);
  const [puntosFiltrados, setPuntosFiltrados] = useState([]);

  const rutaEditar = route.params?.ruta;

  useEffect(() => {
    if (rutaEditar) {
      setNombre(rutaEditar.nombre);
      setDescripcion(rutaEditar.descripcion);
      const puntosMapeados = rutaEditar.puntos_interes.map(p => ({
        id: p.id,
        nombre: p.nombre,
        tipo: p.tipo || p.descripcion
      }));
      setPuntos(puntosMapeados);
    }
  }, [rutaEditar]);

  useEffect(() => {
    if (!loadingPorTipo) {
      if (busqueda.trim()) {
        const puntosFiltrados2 = puntosPorTipo.filter((item) =>
          item.nombre.toLowerCase().includes(busqueda.toLowerCase())
        );
        setPuntosFiltrados(puntosFiltrados2);
      } else {
        setPuntosFiltrados(puntosPorTipo);
      }
    }
  }, [loadingPorTipo, puntosPorTipo, busqueda]);


  const handleInsertadoRuta = async () => {
    if (!nombre.trim()) {
      Alert.alert("Campos obligatorios", "Por favor rellene el nombre");
      return;
    }
    if (!descripcion.trim()) {
      Alert.alert("Campos obligatorios", "Por favor rellene la descripción");
      return;
    }
    if (puntos.length < 2) {
      Alert.alert("Campos obligatorios", "Seleccione al menos dos puntos");
      return;
    }
    const puntosIds = puntos.map(p => p.id);

    try {
      if (rutaEditar) {
        await actualizarRutaPersonalizada({
          userId: global.idUsuario,
          rutaId: rutaEditar.id,
          nombre,
          descripcion,
          puntos: puntosIds
        });
        Alert.alert("Actualizado", "Ruta personalizada actualizada correctamente");
      } else {
        await insertarRutaPersonalizada({
          userId: global.idUsuario,
          nombre,
          descripcion,
          puntos: puntosIds
        });
        Alert.alert("Guardado", "Ruta personalizada guardada correctamente");
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al guardar la ruta");
      console.error(error);
    }
  };

  const seleccionarPunto = (punto) => {
    if (!puntos.some(p => p.id === punto.id)) {
      setPuntos([...puntos, { id: punto.id, nombre: punto.nombre, tipo: punto.tipo }]);
    }
    setMostrarLista(false);
    setBusqueda("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#eef2f7" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.botonVolver} onPress={volver}>
            <Text style={[styles.textoVolver, { fontSize: 22 + modLetra }]}>
              ←
            </Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[styles.title, { fontSize: 40 + modLetra }]}>
              {rutaEditar ? "Editar ruta" : "Rutas personalizadas"}
            </Text>
            <View style={styles.linea}></View>
          </View>

          <View style={styles.content}>
            <TextInput
              style={[styles.input, { fontSize: 16 + modLetra }]}
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => descripcionRef.current.focus()}
            />

            <TextInput
              style={[styles.input, { fontSize: 16 + modLetra }]}
              ref={descripcionRef}
              placeholder="Descripción"
              value={descripcion}
              onChangeText={setDescripcion}
              autoCapitalize="none"
            />

            {puntos.length > 0 && (
              <>
                <Text style={[styles.seccionTitulo, { fontSize: 20 + modLetra }]}>
                  Puntos seleccionados
                </Text>
                <View style={styles.seccionPuntos}>
                  {puntos.map((punto, index) => (
                    <View key={punto.id} style={styles.pointItem}>
                      <View style={styles.pointInfo}>
                        <Text style={[styles.pointName, { fontSize: 16 + modLetra }]}>
                          {punto.nombre}
                        </Text>
                        <Text style={[styles.pointType, { fontSize: 14 + modLetra }]}>
                          {punto.tipo || punto.descripcion}
                        </Text>
                      </View>
                      <Pressable
                        style={styles.deleteButton}
                        onPress={() =>
                          setPuntos(puntos.filter((p) => p.id !== punto.id))
                        }
                      >
                        <Icon name="times-circle" size={24} color="#56618fff" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </>
            )}

            <TouchableOpacity
              onPress={() => setMostrarLista(!mostrarLista)}
              style={[styles.input, { justifyContent: "center" }]}
            >
              <Text
                style={{
                  fontSize: 16 + modLetra,
                  color: "#666",
                }}
              >
                Selecciona puntos
              </Text>
            </TouchableOpacity>

            {mostrarLista && (
              <View style={styles.dropdownContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar..."
                  value={busqueda}
                  onChangeText={setBusqueda}
                />

                <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }}>
                  {puntosFiltrados.map((punto) => (
                    <TouchableOpacity
                      key={punto.id}
                      onPress={() => seleccionarPunto(punto)}
                      style={styles.dropdownItem}
                    >
                      <Text style={{ fontSize: 16 + modLetra }}>{punto.nombre}</Text>
                    </TouchableOpacity>
                  ))}

                  {puntosFiltrados.length === 0 && (
                    <Text style={{ padding: 10, color: "#666" }}>No encontrado</Text>
                  )}
                </ScrollView>
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleInsertadoRuta}>
              <Text style={[styles.buttonText, { fontSize: 24 + modLetra }]}>
                {rutaEditar ? "Actualizar ruta" : "Insertar ruta"}
              </Text>
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
  linea: {
    width: 80,
    height: 4,
    backgroundColor: "#1e3a8a",
    borderRadius: 2,
    marginTop: 8,
  },
  content: { alignItems: "center" },
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

  dropdownContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginTop: -20,
    marginBottom: 30,
    padding: 10,
  },
  searchInput: {
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  seccionPuntos: {
    width: "100%",
    marginVertical: 20,
    padding: 12,
    backgroundColor: "#f7faff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d1e0ff",
    alignSelf: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ff',
    borderRadius: 8,
    marginBottom: 8,
  },
  pointInfo: {
    flex: 1,
  },
  deleteButton: {
    marginLeft: 10,
  },
  pointName: {
    fontWeight: '600',
    color: '#000',
    textAlign: 'center'
  },
  pointType: {
    color: '#666',
    marginTop: 2,
    textAlign: 'center'
  },
  seccionTitulo: {
    fontWeight: "bold",
    color: '#000',
    marginBottom: 8,
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
