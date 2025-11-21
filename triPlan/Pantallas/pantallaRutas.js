import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import Mapa from "../mapaRutas";
import Layout from '../Componentes/layout';
import BottomSheet from '../Componentes/BottomSheet';
import { useBuscaPuntos } from "../Funcionalidades/busquedaPuntos";
import InformacionPunto from './pantallaEspecificacionPunto';
import ListaPuntos from "../Funcionalidades/listadoPuntos"

export default function PantallaRutas({ navigation }) {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [puntosRutas, setPuntosRutas] = useState([]);
  const [navigationSteps, setNavigationSteps] = useState([]);

  // 🔥 Filtros
  const [searchName, setSearchName] = useState("");
  const [maxDuration, setMaxDuration] = useState("");

  const handleMarkersUpdate = (markers) => {
    setPuntosRutas(markers);
  };

  const { puntosPorTipo, loadingPorTipo, errorPorTipo } = useBuscaPuntos();

  useEffect(() => {
    if (!loadingPorTipo && puntosPorTipo.length > 0) {
      setUbicaciones(puntosPorTipo);
    }
  }, [loadingPorTipo, puntosPorTipo]);

  // 🔥 Aplicar filtros (CORREGIDO)
  const filteredRutas = puntosRutas.filter((ruta) => {
    // 1. Filtro por nombre
    const matchName = ruta.nombre
      ?.toLowerCase()
      .includes(searchName.toLowerCase());

    // 2. Filtro por duración (Conversión segura a números)
    // Nota: Asegúrate de que ruta.duracion y maxDuration estén en la misma unidad (ej. minutos)
    const rutaDuracionNum = parseFloat(ruta.duracion) || 0;
    const maxDurationNum = parseFloat(maxDuration);

    const matchDuration = maxDuration
      ? rutaDuracionNum <= maxDurationNum
      : true;

    return matchName && matchDuration;
  });

  return (
    <Layout navigation={navigation}>
      <View style={styles.container}>

        {/* Caja con pasos de navegación */}
        {navigationSteps.length > 0 && (
          <View style={styles.navContainer}>
            <Text style={styles.navTitle}>🧭 Próxima instrucción</Text>
            <Text style={styles.navStep}>
              {navigationSteps[0].instruction}
            </Text>
          </View>
        )}

        {/* Mapa */}
        <Mapa
          ubicaciones={ubicaciones}
          onMarkersUpdate={handleMarkersUpdate}
          onStepsUpdate={setNavigationSteps}
        />
      </View>

      {/* BottomSheet con los puntos */}
      <BottomSheet>

        {puntoSeleccionado ? (

          <InformacionPunto
            punto={puntoSeleccionado}
            onBack={() => setPuntoSeleccionado(null)}
          />

        ) : (

          <>
            {/* 🔥 Filtros */}
            <View style={{ padding: 12 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>Filtrar rutas</Text>

              <TextInput
                placeholder="Buscar por nombre..."
                value={searchName}
                onChangeText={setSearchName}
                style={styles.input}
              />

              <TextInput
                placeholder="Duración máxima (minutos)"
                value={maxDuration}
                onChangeText={setMaxDuration}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            {/* Lista filtrada */}
            <ListaPuntos
              filteredUbis={filteredRutas}
              loading={loadingPorTipo}
              error={errorPorTipo}
              onSelect={(item) => setPuntoSeleccionado(item)}
            />

          </>

        )}

      </BottomSheet>

    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },

  /* Caja de pasos */
  navContainer: {
    position: "absolute",
    top: 30,
    left: 10,
    right: 10,
    zIndex: 1000,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  navTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },
  navStep: {
    fontSize: 14,
    marginBottom: 8
  },

  /* Inputs de filtro */
  input: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginTop: 8
  }
});