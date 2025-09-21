import React from 'react';
import {StyleSheet, Text, View, Pressable, Platform} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BarraInferior({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bottomBar, { bottom: Platform.OS === 'ios' ? 0 : insets.bottom }]}>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Principal')}>
          <Text style={styles.buttonText}>Opción 1</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => navigation.navigate('Segunda')}>
          <Text style={styles.buttonText}>Opción 2</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => alert('Opción 3')}>
          <Text style={styles.buttonText}>Opción 3</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => alert('Opción 4')}>
          <Text style={styles.buttonText}>Opción 4</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    width: '100%',
    height: 60,
    backgroundColor: '#f1f1f1',
    position: 'absolute',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    zIndex: 999,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});