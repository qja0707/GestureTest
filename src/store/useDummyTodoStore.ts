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
    {id: '1', text: '고양이 밥 주기'},
    {id: '2', text: '정원에 물 주기'},
    {id: '3', text: '책 한 권 읽기'},
    {id: '4', text: '커피 한 잔 즐기기'},
    {id: '5', text: '회의 준비하기'},
    {id: '6', text: '이메일 확인하기'},
    {id: '7', text: '집 청소하기'},
    {id: '8', text: '산책하기'},
    {id: '9', text: '식료품 쇼핑하기'},
    {id: '10', text: '저녁 요리하기'},
  ],
  setMoveableTodo: todoList => set({todo: todoList}),
}));

export default useDummyTodoStore;
