import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";

export default function Mapa() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 42.8169,
          longitude: -1.6432,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{ latitude: 42.8169, longitude: -1.6432 }}
          title="Ayuntamiento de Pamplona"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
