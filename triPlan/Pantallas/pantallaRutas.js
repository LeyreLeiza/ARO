import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Mapa from "../mapaRutas"; 
import Layout from '../Componentes/layout';
import BottomSheet from '../Componentes/BottomSheet'; 
import InformacionPunto from './pantallaEspecificacionPunto';
import ListaPuntos from "../Funcionalidades/listadoPuntos"

export default function PantallaRutas({ navigation, route }) {
  const { ruta } = route.params; // ← Recibimos la ruta desde PantallaElegirRutas

  const [detallesRuta, setDetallesRuta] = useState(null); 
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [puntosRutas, setPuntosRutas] = useState([]);
  const [navigationSteps, setNavigationSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleMarkersUpdate = (markers) => setPuntosRutas(markers);

  // 🔹 Cargar los detalles de la ruta (incluye puntos_interes)
  useEffect(() => {
    const fetchRuta = async () => {
      try {
        const response = await fetch(`https://aro-1nwv.onrender.com/rutas/${ruta.id}`);
        if (!response.ok) throw new Error("Error al cargar la ruta");

        const data = await response.json(); // <- data ya es el objeto
        setDetallesRuta(data);              // <- directamente
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


    fetchRuta();
  }, [ruta.id]);

  if (loading) {
    return (
      <Layout navigation={navigation}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#333" />
          <Text style={{ marginTop: 10 }}>Cargando ruta...</Text>
        </View>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout navigation={navigation}>
        <View style={styles.center}>
          <Text style={{ color: "red" }}>Error: {error}</Text>
        </View>
      </Layout>
    );
  }

  if (!detallesRuta) {
    return (
      <Layout navigation={navigation}>
        <View style={styles.center}>
          <Text>No se encontraron datos de la ruta.</Text>
        </View>
      </Layout>
    );
  }

  const puntos = detallesRuta.puntos_interes?.filter(p => p.id !== null) || [];


  return (
    <Layout navigation={navigation}>
      <View style={styles.header}>
        <Text style={styles.tituloRuta}>{detallesRuta.nombre}</Text>
        <Text style={styles.descripcionRuta}>{detallesRuta.descripcion}</Text>
      </View>

      <View style={styles.container}>
        {navigationSteps.length > 0 && (
          <View style={styles.navContainer}>
            <Text style={styles.navTitle}>🧭 Próxima instrucción</Text>
            <Text style={styles.navStep}>{navigationSteps[0].instruction}</Text>
          </View>
        )}

        <Mapa 
          ubicaciones={puntos}
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
  header: {
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tituloRuta: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  descripcionRuta: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
