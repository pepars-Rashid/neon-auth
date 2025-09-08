'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../lib/store';
import { Todo } from '../lib/features/todos/todosSlice';

export default function StoreProvider({
  initialTodos,
  children,
}: {
  initialTodos?: Todo[];
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    // Set initial todos if provided
    if (initialTodos) {
      storeRef.current.dispatch({ type: 'todos/setTodos', payload: initialTodos });
    }
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
