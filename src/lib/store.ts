import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '@/lib/features/todos/todosSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      todos: todosReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types for serializable check
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
