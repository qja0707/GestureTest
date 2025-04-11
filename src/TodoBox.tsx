import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  Vibration,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {runOnJS, SharedValue} from 'react-native-reanimated';
import useMoveableTodoStore from './store/useMoveableTodoStore';
import eventBus from './eventBus';
import {EVENT_NAMES} from './constants/eventNames';
import {Todo} from './store/useDummyTodoStore';

const handleEmit = (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
  eventBus.emit(EVENT_NAMES.TODO_MOVING, {x: e.absoluteX, y: e.absoluteY});
};

interface Props {
  todo: Todo;
  offset: SharedValue<{
    x: number;
    y: number;
  }>;
}

const TodoBox = (props: Props) => {
  const {todo, offset} = props;

  const [isTransparent, setIsTransparent] = useState(false);

  const panEnabled = useRef(false);

  const ref = useRef<View>(null);

  const {todo: moveableTodo, setMoveableTodo} = useMoveableTodoStore(
    state => state,
  );

  const {height, width} = useWindowDimensions();

  const handleLongPress = () => {
    if (!ref?.current) {
      return;
    }

    panEnabled.current = true;

    ref.current.measureInWindow((x: number, y: number) => {
      console.log('x:', x, 'y:', y);
      console.log('width:', width, 'height:', height);
      setMoveableTodo({...todo, style: styles.container, location: {x, y}});

      setIsTransparent(true);

      offset.value = {x: 0, y: 0};
    });

    Vibration.vibrate(10);
  };

  const handleFinalize = () => {
    panEnabled.current = false;

    setIsTransparent(false);

    eventBus.emit(EVENT_NAMES.TODO_FINALIZE);
  };

  const combinedGesture = Gesture.Simultaneous(
    Gesture.Pan()
      .onStart(_ => {
        runOnJS(handleLongPress)();
      })
      .onUpdate(e => {
        if (!moveableTodo) {
          return;
        }

        offset.value = {x: e.translationX, y: e.translationY};

        runOnJS(handleEmit)(e);
      })
      .onFinalize(() => {
        runOnJS(handleFinalize)();
      })
      .activateAfterLongPress(500),
  );

  return (
    <GestureDetector gesture={combinedGesture}>
      <View
        ref={ref}
        style={[styles.container, isTransparent && styles.transparent]}>
        <Text>{todo.text}</Text>
      </View>
    </GestureDetector>
  );
};

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#77DDF9',
    padding: 20,
    borderRadius: 8,
  },
  transparent: {
    display: 'none',
  },
});

export default TodoBox;
