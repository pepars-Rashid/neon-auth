'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser, UserButton } from '@stackframe/stack';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { fetchTodos, addTodoAsync, toggleTodoAsync, deleteTodoAsync, clearError } from '@/lib/features/todos/todosSlice';
import type { Todo } from '@/lib/features/todos/todosSlice';
import Loading from '@/components/Loading';

export default function TodoClient() {
  const user = useUser();
  const dispatch = useAppDispatch();
  const { items, status, error, addStatus, updateStatus, deleteStatus } = useAppSelector((state) => state.todos);
  const [task, setTask] = useState('');

  useEffect(() => {
    if (user?.id && status === 'idle' && items.length === 0) {
      dispatch(fetchTodos());
    }
  }, [user?.id, status, items.length, dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim() || addStatus === 'pending') return;

    try {
      await dispatch(addTodoAsync(task.trim())).unwrap();
      setTask('');
    } catch (err) {
      console.error('Failed to add todo:', err);
    }
  };

  const handleToggleTodo = async (id: number, isComplete: boolean) => {
    if (updateStatus === 'pending') return;
    try {
      await dispatch(toggleTodoAsync({ id, isComplete })).unwrap();
    } catch (err) {
      console.error('Failed to toggle todo:', err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (deleteStatus === 'pending') return;
    try {
      await dispatch(deleteTodoAsync(id)).unwrap();
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Todo App</h2>
            <p className="text-gray-600 mb-6">Please sign in to manage your todos</p>
            <div className="flex gap-3 justify-center">
              <Link 
                href="/handler/sign-in" 
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link 
                href="/handler/sign-up" 
                className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Todos</h1>
                <p className="text-sm text-gray-600">Stay organized and productive</p>
              </div>
            </div>
            <UserButton />
          </div>
        </header>

        {/* Add Todo Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <form onSubmit={handleAddTodo} className="flex gap-3">
            <div className="flex-1">
              <input
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="What needs to be done?"
                className={`${addStatus === 'pending' ? "": "text-black"} w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all `}
                disabled={addStatus === 'pending'}
              />
            </div>
            <button
              type="submit"
              disabled={!task.trim() || addStatus === 'pending'}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2"
            >
              {addStatus === 'pending' ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800 font-medium">Error: {error}</span>
            </div>
          </div>
        )}

        {/* Todos List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {status === 'pending' ? (
            <div className="p-8 text-center">
              <Loading label="Loading your todos..." size={32} />
            </div>
          ) : status === 'failed' ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">Failed to load todos</p>
              <button
                onClick={() => dispatch(fetchTodos())}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
              <p className="text-gray-600">Add your first todo above to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map((todo: Todo) => (
                <div key={todo.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTodo(todo.id, !todo.isComplete)}
                      disabled={updateStatus === 'pending'}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        todo.isComplete
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-gray-300 hover:border-indigo-500'
                      } ${updateStatus === 'pending' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {todo.isComplete && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`font-medium ${todo.isComplete ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {todo.task}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(todo.insertedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      disabled={deleteStatus === 'pending'}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {items.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Total: <span className="font-medium text-gray-900">{items.length}</span>
              </span>
              <span>
                Completed: <span className="font-medium text-gray-900">{items.filter((t: Todo) => t.isComplete).length}</span>
              </span>
              <span>
                Remaining: <span className="font-medium text-gray-900">{items.filter((t: Todo) => !t.isComplete).length}</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
