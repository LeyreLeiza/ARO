import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import DetalleRutaModal from "../Componentes/DetalleRutaModal";
import { useBuscaRutas, useBuscaRutasPersonalizadas } from "../Funcionalidades/busquedaRutas";
import { useFocusEffect } from "@react-navigation/native";
import ListaRutas from "../Funcionalidades/listadoRutas";

export default function PantallaElegirRutas({ navigation }) {
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
  const {rutasPersonalizadas, loadingPersonalizadas, errorPersonalizadas} = useBuscaRutasPersonalizadas(usuarioId, navigation);

  const [tipoSeleccionado, setTipoSeleccionado] = useState('predeterminadas');

  const handleStartRoute = () => {
    if (selectedRoute) {
      navigation.navigate("pantallaRutas", { ruta: selectedRoute });
      setSelectedRoute(null);
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
          style={styles.input}
          placeholder="Buscar por nombre..."
          value={searchName}
          onChangeText={setSearchName}
        />
        <TextInput
          style={styles.input}
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
          <Text style={styles.tipoTexto}>Predeterminadas</Text>
        </Pressable>
        <Pressable style={[
          styles.tipoBoton,     
          tipoSeleccionado === 'personalizadas' && { backgroundColor: '#fff' }]}
          onPress={() => setTipoSeleccionado('personalizadas')}>          
          <Text style={styles.tipoTexto}>Personalizadas</Text>
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
    fontSize: 16,
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
    fontSize: 16,
  },
});
