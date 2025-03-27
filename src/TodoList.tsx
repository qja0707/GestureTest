import React from 'react';
import {LayoutChangeEvent, ScrollView, StyleSheet, View} from 'react-native';
import {SharedValue} from 'react-native-reanimated';
import useDummyTodoStore from './store/useDummyTodoStore';
import TodoBox from './TodoBox';

interface Props {
  todoScrollViewRef: React.RefObject<ScrollView>;
  offset: SharedValue<{
    x: number;
    y: number;
  }>;
}

const TodoList = ({todoScrollViewRef, offset}: Props) => {
  const dummyTodoList = useDummyTodoStore(state => state.todo);

  return (
    <View style={styles.todoContainer}>
      <ScrollView
        contentContainerStyle={styles.bottomScroll}
        ref={todoScrollViewRef}>
        {dummyTodoList.map(item => (
          <TodoBox key={item.id} text={item.text} offset={offset} />
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
