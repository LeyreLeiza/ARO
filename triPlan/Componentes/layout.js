import {View, StyleSheet } from 'react-native';


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