import Layout from '../Componentes/layout';
import { StyleSheet, Text, View } from 'react-native';

export default function PantallaConfiguracion({ navigation }) {
  return (
    <Layout navigation={navigation}>
      <View style={styles.container}>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 10,
  },
  container: {
    flex: 1,
    paddding: 16,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  }, 
});
