## Redux State Management

Location: `src/lib/features/todos/todosSlice.ts`

### Types

```ts
export interface Todo {
  id: number;
  task: string;
  isComplete: boolean;
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
```

### Slice Name
- `todos`

### Initial State
- `items: []`
- `status: 'idle'`
- `error: null`
- `addStatus | updateStatus | deleteStatus: 'idle'`

### Async Thunks

- `fetchTodos()` → calls `getTodos()` then normalizes
- `addTodoAsync(task: string)` → calls `addTodo()` then refetches
- `toggleTodoAsync({ id, isComplete })` → calls `toggleTodo()` then refetches
- `deleteTodoAsync(id: number)` → calls `deleteTodo()` then refetches

### Reducers

- `setTodos(payload: Todo[])`
- `clearError()`
- `resetAddStatus()`
- `resetUpdateStatus()`
- `resetDeleteStatus()`

### Extra Reducers (lifecycle)

- `fetchTodos.pending|fulfilled|rejected` → sets `status`, `items`, `error`
- `addTodoAsync.pending|fulfilled|rejected` → sets `addStatus`, updates `items`
- `toggleTodoAsync.pending|fulfilled|rejected` → sets `updateStatus`, updates `items`
- `deleteTodoAsync.pending|fulfilled|rejected` → sets `deleteStatus`, updates `items`

### Store

Location: `src/lib/store.ts`

```ts
export const makeStore = () => configureStore({
  reducer: { todos: todosReducer },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: { ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'] },
  }),
});

export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
```

### Typed Hooks

Location: `src/lib/hooks.ts`

```ts
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
```

### Usage Example

```tsx
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchTodos, addTodoAsync } from '@/lib/features/todos/todosSlice';

function TodosExample() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector(s => s.todos);

  useEffect(() => { dispatch(fetchTodos()); }, [dispatch]);

  return (
    <div>
      <p>Status: {status}</p>
      <button onClick={() => dispatch(addTodoAsync('New task'))}>Add</button>
      {items.map(t => <div key={t.id}>{t.task}</div>)}
    </div>
  );
}
```

