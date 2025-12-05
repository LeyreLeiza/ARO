import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import DetalleRutaModal from "../Componentes/DetalleRutaModal";
import { useBuscaRutas, useBuscaRutasPersonalizadas } from "../Funcionalidades/busquedaRutas";
import { eliminarRutaPersonalizada } from "../Funcionalidades/busquedaUsuarios";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from 'expo-location';
import ListaRutas from "../Funcionalidades/listadoRutas";

// 🔹 Importamos el hook para acceder al tamaño de letra
import { useFontSize } from '../Componentes/FontSizeContext'; 

export default function PantallaElegirRutas({ navigation }) {
  // 🔹 Obtenemos el modificador de tamaño de letra del contexto
  const { fontSizeMod } = useFontSize(); 
  
  const [searchName, setSearchName] = useState("");
  const [maxDuration, setMaxDuration] = useState("");

  const [selectedRoute, setSelectedRoute] = useState(null);

  const [usuarioId, setUsuarioId] = useState(global.idUsuario);
  useFocusEffect(
    React.useCallback(() => {
      setUsuarioId(global.idUsuario);
    }, [])
  );

  const [reloadFlag, setReloadFlag] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setReloadFlag(prev => !prev); // al volver aquí recarga todo
    }, [])
  );

  const { rutas, loading, error } = useBuscaRutas();
  const { rutasPersonalizadas, loadingPersonalizadas, errorPersonalizadas } = useBuscaRutasPersonalizadas(usuarioId, navigation, reloadFlag);

  const [tipoSeleccionado, setTipoSeleccionado] = useState('predeterminadas');

  const handleStartRoute = async () => {
    if (selectedRoute) {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permiso denegado", "Necesitas activar la ubicación para iniciar la ruta.");
          return;
        }

        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
          Alert.alert("Ubicación desactivada", "Por favor, activa la ubicación del dispositivo para continuar.");
          return;
        }

        navigation.navigate("pantallaRutas", { ruta: selectedRoute });
        setSelectedRoute(null);
      } catch (error) {
        console.error("Error checking location:", error);
        Alert.alert("Error", "No se pudo verificar la ubicación.");
      }
    }
  };

  const handleDelete = async (rutaId) => {
    try {
      Alert.alert(
        "Eliminar ruta",
        "¿Estás seguro de que quieres eliminar esta ruta?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: async () => {
              await eliminarRutaPersonalizada({ userId: usuarioId, rutaId });
              setReloadFlag(prev => !prev);
              setSelectedRoute(null);
              Alert.alert("Éxito", "Ruta eliminada correctamente");
            }
          }
        ]
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo eliminar la ruta");
    }
  };


  const getRutasFiltradas = (rutas) => {
    return rutas.filter(ruta => {
      const matchesName = ruta.nombre.toLowerCase().includes(searchName.toLowerCase());
      const matchesDuration = maxDuration ? ruta.duracion <= parseInt(maxDuration) : true;
      return matchesName && matchesDuration;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TextInput
          style={[styles.input, { fontSize: 16 + fontSizeMod }]} // 🔹 Aplicamos fontSizeMod
          placeholder="Buscar por nombre..."
          value={searchName}
          onChangeText={setSearchName}
        />
        <TextInput
          style={[styles.input, { fontSize: 16 + fontSizeMod }]} // 🔹 Aplicamos fontSizeMod
          placeholder="Duración máx. (min)"
          value={maxDuration}
          onChangeText={setMaxDuration}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.tipos}>
        <Pressable style={[
          styles.tipoBoton,
          tipoSeleccionado === 'predeterminadas' && { backgroundColor: '#fff' }]}
          onPress={() => setTipoSeleccionado('predeterminadas')}>
          <Text style={[styles.tipoTexto, { fontSize: 16 + fontSizeMod }]}>Predeterminadas</Text>
        </Pressable>
        <Pressable style={[
          styles.tipoBoton,
          tipoSeleccionado === 'personalizadas' && { backgroundColor: '#fff' }]}
          onPress={() => setTipoSeleccionado('personalizadas')}>
          <Text style={[styles.tipoTexto, { fontSize: 16 + fontSizeMod }]}>Personalizadas</Text>
        </Pressable>
      </View>

      <ListaRutas
        rutasFiltradas={tipoSeleccionado === 'predeterminadas'
          ? getRutasFiltradas(rutas)
          : getRutasFiltradas(rutasPersonalizadas) || []}
        personalizadas={tipoSeleccionado === 'personalizadas'}
        loading={tipoSeleccionado === 'predeterminadas' ? loading : loadingPersonalizadas}
        error={tipoSeleccionado === 'predeterminadas' ? error : errorPersonalizadas}
        onSelect={setSelectedRoute}
        navigation={navigation}
      />

      {/* Modal de Detalle de Ruta */}
      <DetalleRutaModal
        visible={!!selectedRoute}
        ruta={selectedRoute}
        onClose={() => setSelectedRoute(null)}
        onStartRoute={handleStartRoute}
        isCustom={tipoSeleccionado === 'personalizadas'}
        onDelete={() => handleDelete(selectedRoute?.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  filterContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    // fontSize: 16, // 🔹 Eliminado para usar el estilo en línea
  },
  tipos: {
    flexDirection: 'row',
    alignSelf: 'center',
    margin: 10,
    padding: 2,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
  },
  tipoBoton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  tipoTexto: {
    color: '#000',
    fontWeight: 'bold',
    // fontSize: 16, // 🔹 Eliminado para usar el estilo en línea
  },
});