import {View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Layout({ children, navigation }) {
  return (
      <View style={styles.content}>
        {children}
      </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1, 
    paddingBottom: 30, 
  },
});