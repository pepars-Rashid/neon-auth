# Neon Auth + Redux Todo App (Concise Overview)

Modern Todo app built with Next.js 15, Neon Auth, PostgreSQL (via Drizzle ORM), Redux Toolkit, Tailwind CSS, and TypeScript.

## Quick Start

```bash
npm install
npm run dev
```

Environment (`.env.local`):

```env
NEXT_PUBLIC_STACK_PROJECT_ID=...
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=...
STACK_SECRET_SERVER_KEY=...
DATABASE_URL=postgresql://user:pass@host/db
```

## What’s Inside (Summary)

- Auth: Neon Auth (Stack). `src/stack.ts`, used in `layout.tsx`.
- Data: Drizzle ORM + Neon Postgres. Tables in `src/app/db/schema.ts`.
- Server Actions (API): `src/app/actions/todoActions.ts`
  - `getTodos()` returns current user todos (ordered by newest)
  - `addTodo(task)` adds a todo
  - `toggleTodo(id, isComplete)` updates completion
  - `deleteTodo(id)` removes a todo
- Components:
  - `src/app/TodoClient.tsx` main UI (CRUD + auth gating)
  - `src/app/StoreProvider.tsx` Redux provider (optionally hydrates initial todos)
  - `src/components/Loading.tsx` simple spinner
- Utilities: `src/lib/utils/todoUtils.ts` normalizes DB rows into serializable todos (ISO dates).

## Redux State Management (How We Use It)

- Store: `src/lib/store.ts` with `todos` slice reducer registered. Typed hooks in `src/lib/hooks.ts`.
- Slice: `src/lib/features/todos/todosSlice.ts` manages todos with explicit operation states.

State shape (simplified):

```ts
interface Todo { id: number; task: string; isComplete: boolean; insertedAt: string }
interface TodosState {
  items: Todo[];
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
  addStatus: 'idle' | 'pending' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'pending' | 'succeeded' | 'failed';
  deleteStatus: 'idle' | 'pending' | 'succeeded' | 'failed';
}
```

Async thunks (each calls a server action, then refreshes with `getTodos()`):

- `fetchTodos()`
- `addTodoAsync(task)`
- `toggleTodoAsync({ id, isComplete })`
- `deleteTodoAsync(id)`

Reducers provided for UI housekeeping: `setTodos`, `clearError`, `resetAddStatus`, `resetUpdateStatus`, `resetDeleteStatus`.

Usage pattern:

```tsx
const dispatch = useAppDispatch();
const { items, status, addStatus, updateStatus, deleteStatus } = useAppSelector(s => s.todos);
useEffect(() => { dispatch(fetchTodos()); }, [dispatch]);
```

Why this structure:

- Separate operation statuses avoid UI conflicts (e.g., adding vs toggling)
- Errors are centralized and auto-cleared in the UI
- Dates normalized to ISO to satisfy Redux serializability

## Minimal Project Map

```
src/
  app/
    actions/todoActions.ts  # CRUD (server actions)
    db/{index.ts,schema.ts} # Drizzle + schema
    {layout.tsx,page.tsx,StoreProvider.tsx,TodoClient.tsx}
  components/Loading.tsx
  lib/
    features/todos/todosSlice.ts
    {store.ts,hooks.ts}
    utils/todoUtils.ts
```

## Build & Deploy

```bash
npm run build
npm start
```

Works great on Vercel. Ensure env vars are configured.
