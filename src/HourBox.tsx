import React, {useEffect, useRef, useState} from 'react';
import {LayoutChangeEvent, StyleSheet, Text, View} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import eventBus from './eventBus';
import useMoveableTodoStore from './store/useMoveableTodoStore';
import TodoBox from './TodoBox';
import useDummyTodoStore from './store/useDummyTodoStore';

interface Props {
  hour: number;
  isScrolling: boolean;
  isVisible: boolean;
}

const HourBox = (props: Props) => {
  const {hour, isScrolling, isVisible} = props;

  const [isHovered, setIsHovered] = useState(false);

  const [todoList, setTodoList] = useState<string[]>([]);

  const coordY = useRef<[number, number]>([0, 0]);

  const ref = useRef<View>(null);

  const todo = useMoveableTodoStore(state => state.todo);
  const setMoveableTodo = useMoveableTodoStore(state => state.setMoveableTodo);

  const dummyTodoList = useDummyTodoStore(state => state.todo);
  const setDummyTodo = useDummyTodoStore(state => state.setMoveableTodo);

  const offset = useSharedValue({x: 0, y: 0});

  useEffect(() => {
    // 이벤트 구독
    const handlePan = (data: {x: number; y: number}) => {
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

    eventBus.on('todoMoving', handlePan);

    return () => {
      eventBus.off('todoMoving', handlePan);
    };
  }, [isHovered, isVisible]);

  useEffect(() => {
    const handleFinalize = () => {
      if (!todo) {
        return;
      }

      if (!isHovered) {
        return;
      }

      setDummyTodo(dummyTodoList.filter(dummy => dummy.text !== todo.text));

      setMoveableTodo(null);

      setIsHovered(false);

      setTodoList([...todoList, todo.text]);
    };

    eventBus.on('todoFinalize', handleFinalize);

    return () => {
      eventBus.off('todoFinalize', handleFinalize);
    };
  }, [todo, isHovered, todoList, setMoveableTodo, setDummyTodo, dummyTodoList]);

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
      <Text>{`${hour}:00`}</Text>
      {todoList.map(todoItem => (
        <TodoBox key={todoItem} text={todoItem} offset={offset} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  timeBox: {
    paddingHorizontal: 20,
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: '#C5C5C5',
    flexDirection: 'row',
  },
  hoveredBackground: {
    backgroundColor: '#C5C5C5',
  },
});

export default HourBox;
