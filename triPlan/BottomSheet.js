import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const BottomSheet = () => {
  const [open, setOpen] = useState(false);
  const [height] = useState(new Animated.Value(0));

  const toggleSheet = () => {
    Animated.timing(height, {
      toValue: open ? 0 : 200, // altura del panel
      duration: 300,
      useNativeDriver: false,
    }).start();
    setOpen(!open);
  };

  return (
    <View style={styles.container}>
      {/* Botón (barra gris) */}
      <TouchableOpacity onPress={toggleSheet} style={styles.handle} />

      {/* Panel deslizable vacío */}
      <Animated.View style={[styles.sheet, { height }]}>
        {/* Aquí metes más adelante el contenido */}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  handle: {
    width: 50,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
  sheet: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
});

export default BottomSheet;
