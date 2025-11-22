import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Mapa from "../mapaRutas";
import Layout from '../Componentes/layout';
import BottomSheet from '../Componentes/BottomSheet';
import { useBuscaPuntos } from "../Funcionalidades/busquedaPuntos";
import InformacionPunto from './pantallaEspecificacionPunto';
import ListaPuntos from "../Funcionalidades/listadoPuntos";

export default function PantallaRutas({ navigation, route }) {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [puntosRutas, setPuntosRutas] = useState([]);
  const [navigationSteps, setNavigationSteps] = useState([]);
  const [errorRuta, setErrorRuta] = useState(null);
  const [loadingRuta, setLoadingRuta] = useState(false);

  const rutaSeleccionada = route?.params?.ruta;
  const haCargadoRuta = useRef(false); // ✅ evita repetir la carga

  // Solo usamos useBuscaPuntos si NO hay ruta seleccionada
  const { puntosPorTipo, loadingPorTipo, errorPorTipo } = useBuscaPuntos(
    rutaSeleccionada ? null : []
  );

  // 🚀 Cargar la ruta seleccionada UNA SOLA VEZ
  useEffect(() => {
    const fetchRuta = async () => {
      if (!rutaSeleccionada || haCargadoRuta.current) return;
      haCargadoRuta.current = true; // ✅ bloquea futuras ejecuciones

      try {
        setLoadingRuta(true);
        const response = await fetch(`https://aro-1nwv.onrender.com/rutas/${rutaSeleccionada.id}`);
        if (!response.ok) throw new Error("Error al obtener datos de la ruta");

        const data = await response.json();
        setUbicaciones(data?.puntos_interes || []);
      } catch (err) {
        console.error("Error al cargar la ruta:", err);
        setErrorRuta(err.message);
      } finally {
        setLoadingRuta(false);
      }
    };

    fetchRuta();
  }, [rutaSeleccionada]);

  // 🗺️ Si no hay ruta seleccionada, mostramos todos los puntos
  useEffect(() => {
    if (!rutaSeleccionada && !loadingPorTipo && puntosPorTipo?.length > 0) {
      setUbicaciones(puntosPorTipo);
    }
  }, [rutaSeleccionada, loadingPorTipo]);

  const handleMarkersUpdate = (markers) => setPuntosRutas(markers);

  const handleExitRoute = () => {
    navigation.setParams({ ruta: null });
    haCargadoRuta.current = false;
    setUbicaciones(puntosPorTipo);
    setNavigationSteps([]);
    setErrorRuta(null);
    navigation.goBack();
  };

  return (
    <Layout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.tituloContainer}>
          <View>
            <Text style={styles.tituloPantalla}>Rutas</Text>
          </View>
          {rutaSeleccionada && (
            <TouchableOpacity onPress={handleExitRoute} style={styles.exitButton}>
              <Ionicons name="close-circle" size={24} color="red" />
              <Text style={styles.exitText}>Salir de ruta</Text>
            </TouchableOpacity>
          )}
        </View>
        {navigationSteps.length > 0 && (
          <View style={styles.navContainer}>
            <Text style={styles.navTitle}>🧭 Próxima instrucción</Text>
            <Text style={styles.navStep}>{navigationSteps[0].instruction}</Text>
          </View>
        )}

        {errorRuta && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorRuta}</Text>
          </View>
        )}

        <Mapa
          ubicaciones={ubicaciones}
          onMarkersUpdate={handleMarkersUpdate}
          onStepsUpdate={setNavigationSteps}
        />
      </View>

      <BottomSheet>
        {puntoSeleccionado ? (
          <InformacionPunto
            punto={puntoSeleccionado}
            onBack={() => setPuntoSeleccionado(null)}
          />
        ) : (
          <ListaPuntos
            filteredUbis={puntosRutas}
            loading={loadingRuta || loadingPorTipo}
            error={errorPorTipo || errorRuta}
            onSelect={(item) => setPuntoSeleccionado(item)}
          />
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
  navContainer: {
    position: "absolute",
    top: 100,
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
  errorBox: {
    padding: 15,
    backgroundColor: "#ffe0e0",
    margin: 10,
    borderRadius: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  tituloContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  tituloPantalla: {
    fontSize: 22,
    fontWeight: '500',
    backgroundColor: '#f0f0f0',
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exitText: {
    color: 'red',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
