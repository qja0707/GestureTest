import React, {useEffect, useRef} from 'react';
import {LayoutChangeEvent, ScrollView, StyleSheet, View} from 'react-native';
import {SharedValue} from 'react-native-reanimated';
import useDummyTodoStore from './store/useDummyTodoStore';
import TodoBox from './TodoBox';
import {LocationCoord} from './types';
import {EVENT_NAMES} from './constants/eventNames';
import eventBus from './eventBus';
import useMoveableTodoStore from './store/useMoveableTodoStore';
interface Props {
  todoScrollViewRef: React.RefObject<ScrollView>;
  offset: SharedValue<{
    x: number;
    y: number;
  }>;
}

const TodoList = ({todoScrollViewRef, offset}: Props) => {
  const dummyTodoList = useDummyTodoStore(state => state.todo);
  const setDummyTodo = useDummyTodoStore(state => state.setMoveableTodo);

  const moveableTodo = useMoveableTodoStore(state => state.todo);
  const setMoveableTodo = useMoveableTodoStore(state => state.setMoveableTodo);

  const coordY = useRef<number>(0);

  const isHovered = useRef<boolean>(false);

  useEffect(() => {
    // 이벤트 구독
    const handlePan = (data: LocationCoord) => {
      isHovered.current = data.y > coordY.current;
    };

    eventBus.on(EVENT_NAMES.TODO_MOVING, handlePan);

    return () => {
      eventBus.off(EVENT_NAMES.TODO_MOVING, handlePan);
    };
  }, []);

  useEffect(() => {
    // 이벤트 구독
    const handleFinalize = () => {
      if (!isHovered.current) {
        return;
      }

      if (!moveableTodo) {
        return;
      }

      setMoveableTodo(null);

      if (dummyTodoList.find(todo => todo.id === moveableTodo.id)) {
        return;
      }

      setDummyTodo([...dummyTodoList, moveableTodo]);
    };

    eventBus.on(EVENT_NAMES.TODO_FINALIZE, handleFinalize);

    return () => {
      eventBus.off(EVENT_NAMES.TODO_FINALIZE, handleFinalize);
    };
  }, [dummyTodoList, moveableTodo, setDummyTodo, setMoveableTodo]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const {y} = e.nativeEvent.layout;

    coordY.current = y;
  };

  return (
    <View style={styles.todoContainer} onLayout={handleLayout}>
      <ScrollView
        contentContainerStyle={styles.bottomScroll}
        ref={todoScrollViewRef}>
        {dummyTodoList.map(item => (
          <TodoBox key={item.id} todo={item} offset={offset} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  todoContainer: {
    flex: 1,
    borderTopWidth: 3,
  },
  bottomScroll: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
});

export default TodoList;
