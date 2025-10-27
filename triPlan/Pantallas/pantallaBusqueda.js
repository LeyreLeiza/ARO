import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useBuscaPuntos } from "../Funcionalidades/busquedaPuntos";

export default function App() {
  const { puntos, loading, error } = useBuscaPuntos();

  //Render de cargar datos 
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  //Si hay un error coloca texto rojo de error
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </View>
    );
  }

  //devuelve datos -> variable puntos metida y mostrada en un ScrollView
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { marginTop: 0 }]}>Puntos de interés</Text>
      <ScrollView>  
        {puntos.length === 0 ? (
          <Text>No hay datos disponibles</Text>
        ) : (
          puntos.map((p, index) => (
            <Text key={index} style={styles.item}>
              {p.NOMBRE}
            </Text>
          ))
        )}
      </ScrollView>
    </View>
  );
}

//estilos
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  item: { fontSize: 18, marginBottom: 8 },
});