import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
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

  const handleMarkersUpdate = (markers) => {
    setPuntosRutas(markers);
  };

  const { puntos, loading, error } = useBuscaPuntos();

  useEffect(() => {
    if (!loading && puntos.length > 0) {
      const nuevasUbis = puntos.map((p) => ({
        id: p.id.toString(),
        titulo: p.nombre,
        lon: Number(p.longitud),
        lat: Number(p.latitud),
        tipo: p.tipo,
        descripcion: p.descripcion,
        imagen: p.imagen
      }));

      setUbicaciones(nuevasUbis);
    }
  }, [loading, puntos]);

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
          <ListaPuntos
            filteredUbis={puntosRutas}
            loading={loading}
            error={error}
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
});
