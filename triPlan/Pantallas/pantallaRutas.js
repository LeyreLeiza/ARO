import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { marginTop: 0 }]}>Rutas</Text>
    </View>
  );
}

//estilos
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});