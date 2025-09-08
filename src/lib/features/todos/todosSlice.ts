import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getTodos, addTodo, toggleTodo, deleteTodo } from '@/app/actions/todoActions';
import { normalizeTodos } from '../../utils/todoUtils';

export interface Todo {
  id: number;
  task: string;
  isComplete: boolean;
  // ownerId: string;
  insertedAt: string;
}

interface TodosState {
  items: Todo[];
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
  addStatus: 'idle' | 'pending' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'pending' | 'succeeded' | 'failed';
  deleteStatus: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: TodosState = {
  items: [],
  status: 'idle',
  error: null,
  addStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
};

// Async thunks
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async () => {
    const response = await getTodos();
    return normalizeTodos(response);
  }
);

export const addTodoAsync = createAsyncThunk(
  'todos/addTodo',
  async (task: string) => {
    await addTodo(task);
    // Refetch todos to get the updated list with the new todo
    const response = await getTodos();
    return normalizeTodos(response);
  }
);

export const toggleTodoAsync = createAsyncThunk(
  'todos/toggleTodo',
  async ({ id, isComplete }: { id: number; isComplete: boolean }) => {
    await toggleTodo(id, isComplete);
    // Refetch todos to get the updated list
    const response = await getTodos();
    return normalizeTodos(response);
  }
);

export const deleteTodoAsync = createAsyncThunk(
  'todos/deleteTodo',
  async (id: number) => {
    await deleteTodo(id);
    // Refetch todos to get the updated list
    const response = await getTodos();
    return normalizeTodos(response);
  }
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.items = normalizeTodos(action.payload);
      state.status = 'succeeded';
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAddStatus: (state) => {
      state.addStatus = 'idle';
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = 'idle';
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch todos
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch todos';
      })
      // Add todo
      .addCase(addTodoAsync.pending, (state) => {
        state.addStatus = 'pending';
        state.error = null;
      })
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.addStatus = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addTodoAsync.rejected, (state, action) => {
        state.addStatus = 'failed';
        state.error = action.error.message || 'Failed to add todo';
      })
      // Toggle todo
      .addCase(toggleTodoAsync.pending, (state) => {
        state.updateStatus = 'pending';
        state.error = null;
      })
      .addCase(toggleTodoAsync.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.items = action.payload;
      })
      .addCase(toggleTodoAsync.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.error.message || 'Failed to update todo';
      })
      // Delete todo
      .addCase(deleteTodoAsync.pending, (state) => {
        state.deleteStatus = 'pending';
        state.error = null;
      })
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.items = action.payload;
      })
      .addCase(deleteTodoAsync.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.error.message || 'Failed to delete todo';
      });
  },
});

export const { setTodos, clearError, resetAddStatus, resetUpdateStatus, resetDeleteStatus } = todosSlice.actions;
export default todosSlice.reducer;
