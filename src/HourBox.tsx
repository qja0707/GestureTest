import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SharedValue} from 'react-native-reanimated';
import {EVENT_NAMES} from './constants/eventNames';
import eventBus from './eventBus';
import useDummyTodoStore, {Todo} from './store/useDummyTodoStore';
import useMoveableTodoStore from './store/useMoveableTodoStore';
import TodoBox from './TodoBox';
import {LocationCoord} from './types';

interface Props {
  hour: number;
  isScrolling: boolean;
  isVisible: boolean;
  offset: SharedValue<LocationCoord>;
}

const HourBox = (props: Props) => {
  const {hour, isScrolling, isVisible, offset} = props;

  const [isHovered, setIsHovered] = useState(false);

  const [todoList, setTodoList] = useState<Todo[]>([]);

  const coordY = useRef<[number, number]>([0, 0]);

  const ref = useRef<View>(null);

  const moveableTodo = useMoveableTodoStore(state => state.todo);
  const setMoveableTodo = useMoveableTodoStore(state => state.setMoveableTodo);

  const dummyTodoList = useDummyTodoStore(state => state.todo);
  const setDummyTodo = useDummyTodoStore(state => state.setMoveableTodo);

  useEffect(() => {
    // 이벤트 구독
    const handlePan = (data: LocationCoord) => {
      if (!isVisible) {
        return;
      }

      if (data.y < coordY.current[0] || data.y > coordY.current[1]) {
        setIsHovered(false);

        return;
      }

      if (isHovered) {
        return;
      }

      setIsHovered(true);
    };

    eventBus.on(EVENT_NAMES.TODO_MOVING, handlePan);

    return () => {
      eventBus.off(EVENT_NAMES.TODO_MOVING, handlePan);
    };
  }, [isHovered, isVisible]);

  useEffect(() => {
    const handleFinalize = () => {
      if (!moveableTodo) {
        return;
      }

      if (!isHovered) {
        if (todoList.find(todo => todo.id === moveableTodo.id)) {
          setTodoList(todoList.filter(todo => todo.id !== moveableTodo.id));
        }

        return;
      }

      if (!todoList.find(todo => todo.id === moveableTodo.id)) {
        setDummyTodo(
          dummyTodoList.filter(dummy => dummy.id !== moveableTodo.id),
        );

        setTodoList([...todoList, moveableTodo]);

        console.log('todoList', todoList);
      }

      setMoveableTodo(null);

      setIsHovered(false);
    };

    eventBus.on(EVENT_NAMES.TODO_FINALIZE, handleFinalize);

    return () => {
      eventBus.off(EVENT_NAMES.TODO_FINALIZE, handleFinalize);
    };
  }, [
    moveableTodo,
    isHovered,
    todoList,
    setMoveableTodo,
    setDummyTodo,
    dummyTodoList,
  ]);

  useEffect(() => {
    if (isScrolling) {
      return;
    }

    ref.current?.measureInWindow((x, y, width, height) => {
      coordY.current = [Math.max(y, 0), Math.max(height + y, 0)];
    });
  }, [hour, isScrolling, isVisible]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const {y, height} = e.nativeEvent.layout;
    coordY.current = [y, height + y];
  };

  return (
    <View
      ref={ref}
      style={[styles.timeBox, isHovered && styles.hoveredBackground]}
      onLayout={handleLayout}>
      <Text style={styles.timeText}>{`${hour}:00`}</Text>
      <ScrollView
        contentContainerStyle={styles.listContainer}
        horizontal={true}>
        {todoList.map(todoItem => (
          <TodoBox key={todoItem.id} todo={todoItem} offset={offset} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  timeBox: {
    paddingHorizontal: 20,
    width: '100%',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#C5C5C5',
    flexDirection: 'row',
    padding: 8,
  },
  timeText: {
    marginRight: 10,
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  hoveredBackground: {
    backgroundColor: '#C5C5C5',
  },
});

export default HourBox;
