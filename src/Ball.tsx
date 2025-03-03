import React from 'react';
import { StyleSheet, Vibration } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const vibrate = () => {
  Vibration.vibrate(10);
};

const Ball = () => {
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({ x: 0, y: 0 });

  const start = useSharedValue({ x: 0, y: 0 });

  const longPressGesture = Gesture.LongPress()
    .minDuration(300)
    .onStart(() => {
      isPressed.value = true;

      runOnJS(vibrate)();
    });

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      if (!isPressed.value) {
        return;
      }

      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      if (!isPressed.value) {
        return;
      }

      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  const composedGesture = Gesture.Simultaneous(longPressGesture, panGesture);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: withSpring(isPressed.value ? 1.2 : 1) },
      ],
      backgroundColor: isPressed.value ? 'yellow' : 'blue',
    };
  });

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[styles.ball, animatedStyles]} />
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  ball: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 100,
    // backgroundColor: 'blue',
    alignSelf: 'center',
  },
});

export default Ball;
