import {StyleProp, ViewStyle} from 'react-native';
import {create} from 'zustand';
import {Todo} from './useDummyTodoStore';

interface MoveableTodo extends Todo {
  style: StyleProp<ViewStyle>;
  location: {x: number; y: number};
}

interface UseMoveableTodoStore {
  todo: MoveableTodo | null;
  setMoveableTodo: (todo: MoveableTodo | null) => void;
}

const useMoveableTodoStore = create<UseMoveableTodoStore>(set => ({
  todo: null,
  setMoveableTodo: todo => set({todo}),
}));

export default useMoveableTodoStore;
