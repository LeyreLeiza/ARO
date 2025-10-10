import React, { useRef } from 'react';
import { View, StyleSheet, Animated, PanResponder } from 'react-native';

const MIN_HEIGHT = 80;   // altura mínima (solo el asa)
const MAX_HEIGHT = 500;  // altura máxima

const BottomSheet = () => {
  const sheetHeight = useRef(new Animated.Value(MIN_HEIGHT)).current;
  const lastHeight = useRef(MIN_HEIGHT); // guardamos la última altura al soltar

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (evt, gestureState) => {
        let newHeight = lastHeight.current - gestureState.dy; 
        // movimiento relativo al último valor

        if (newHeight < MIN_HEIGHT) newHeight = MIN_HEIGHT;
        if (newHeight > MAX_HEIGHT) newHeight = MAX_HEIGHT;

        sheetHeight.setValue(newHeight);
      },

      onPanResponderRelease: () => {
        lastHeight.current = sheetHeight.__getValue(); // guardamos la altura final
      },
    })
  ).current;

  return (
    <Animated.View style={[styles.sheet, { height: sheetHeight }]}>
      {/* Asa (zona para arrastrar) */}
      <View style={styles.handleArea} {...panResponder.panHandlers}>
        <View style={styles.handle} />
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        {/* Aquí iría la info de las rutas o lo que quieras */}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0, // deja espacio para el TabNavigator
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  handleArea: {
    alignItems: 'center',
    padding: 20, // área clicable más grande
  },
  handle: {
    width: 80,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  content: {
    flex: 1,
    padding: 10,
  },
});

export default BottomSheet;
