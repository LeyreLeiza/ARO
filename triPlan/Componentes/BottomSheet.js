import React, { useRef } from 'react';
import { View, StyleSheet, Animated, PanResponder } from 'react-native';

const MIN_HEIGHT = 80;
const MAX_HEIGHT = 600;

const BottomSheet = ({ children }) => {
  const sheetHeight = useRef(new Animated.Value(MIN_HEIGHT)).current;
  const lastHeight = useRef(MIN_HEIGHT);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (evt, gestureState) => {
        let newHeight = lastHeight.current - gestureState.dy;

        if (newHeight < MIN_HEIGHT) newHeight = MIN_HEIGHT;
        if (newHeight > MAX_HEIGHT) newHeight = MAX_HEIGHT;

        sheetHeight.setValue(newHeight);
      },

      onPanResponderRelease: () => {
        lastHeight.current = sheetHeight.__getValue();
      },
    })
  ).current;

  return (
    <Animated.View style={[styles.sheet, { height: sheetHeight }]}>
      <View style={styles.handleArea} {...panResponder.panHandlers}>
        <View style={styles.handle} />
      </View>

      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    overflow: 'hidden',
  },
  handleArea: {
    alignItems: 'center',
    padding: 15,
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
