import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import useMoveableTodoStore from './store/useMoveableTodoStore';

interface Props {
  offset: SharedValue<{
    x: number;
    y: number;
  }>;
}

const MoveableTodoBox = (props: Props) => {
  const { offset } = props;

  const todo = useMoveableTodoStore(state => state.todo);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: withSpring(todo ? 1.2 : 1) },
      ],
      backgroundColor: todo ? 'yellow' : 'blue',
    };
  });

  const startLocation = StyleSheet.create({
    start: { left: todo?.location.x || 0, top: todo?.location.y || 0 },
  });

  if (!todo) {
    return null;
  }

  return (
    // <GestureDetector gesture={composedGesture}>
    <Animated.View
      style={[
        todo.style,
        startLocation.start,
        animatedStyles,
        { position: 'absolute' },
      ]}>
      <Text>{todo?.text}</Text>
    </Animated.View>
    // </GestureDetector>
  );
};

export default MoveableTodoBox;
