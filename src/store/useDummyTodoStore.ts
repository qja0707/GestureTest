import {create} from 'zustand';

export interface Todo {
  id: string;
  text: string;
}

interface TodoDummyList {
  todo: Todo[];
  setMoveableTodo: (todoList: Todo[]) => void;
}

const useDummyTodoStore = create<TodoDummyList>(set => ({
  todo: [
    {id: '1', text: 'Feed the cat'},
    {id: '2', text: 'Water the garden'},
    {id: '3', text: 'Read a book'},
    {id: '4', text: 'Enjoy a cup of coffee'},
    {id: '5', text: 'Prepare for meeting'},
    {id: '6', text: 'Check emails'},
    {id: '7', text: 'Clean the house'},
    {id: '8', text: 'Go for a walk'},
    {id: '9', text: 'Grocery shopping'},
    {id: '10', text: 'Cook dinner'},
  ],
  setMoveableTodo: todoList => set({todo: todoList}),
}));

export default useDummyTodoStore;
