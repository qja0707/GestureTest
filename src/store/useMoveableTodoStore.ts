import {StyleProp, ViewStyle} from 'react-native';
import {create} from 'zustand';

interface Todo {
  text: string;
  style: StyleProp<ViewStyle>;
  location: {x: number; y: number};
}

interface UseMoveableTodoStore {
  todo: Todo | null;
  setMoveableTodo: (todo: Todo | null) => void;
}

const useMoveableTodoStore = create<UseMoveableTodoStore>(set => ({
  todo: null,
  setMoveableTodo: todo => set({todo}),
}));

export default useMoveableTodoStore;
