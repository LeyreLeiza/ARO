import { View, Text, StyleSheet } from "react-native";
import Mapa from "./mapa"; 

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa</Text>
      <Mapa />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});
