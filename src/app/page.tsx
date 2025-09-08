'use client';
import { useEffect, useState } from 'react';
import { getTodos } from '@/app/actions/todoActions';
import StoreProvider from './StoreProvider';
import TodoClient from './TodoClient';
import { normalizeTodos } from '@/lib/utils/todoUtils';
import Loading from '@/components/Loading';

export default function Home() {
  const [initialTodos, setInitialTodos] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await getTodos();
        const normalizedTodos = normalizeTodos(todos);
        setInitialTodos(normalizedTodos);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <StoreProvider initialTodos={initialTodos}>
      <TodoClient />
    </StoreProvider>
  );
}