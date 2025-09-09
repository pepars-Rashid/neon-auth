## Server Actions API

All server actions live in `src/app/actions/todoActions.ts` and require an authenticated user via `stackServerApp.getUser()`.

### addTodo(task: string): Promise<void>
- Adds a new todo for the authenticated user.
- Throws on unauthenticated.

Example:
```ts
import { addTodo } from '@/app/actions/todoActions';
await addTodo('Buy milk');
```

### getTodos(): Promise<Array<{ id: number; task: string; isComplete: boolean; insertedAt: string | Date }>>
- Returns the user's todos ordered by `insertedAt` desc. Returns an empty array if unauthenticated.

Example:
```ts
import { getTodos } from '@/app/actions/todoActions';
const rows = await getTodos();
```

### toggleTodo(id: number, isComplete: boolean): Promise<void>
- Updates completion for a todo belonging to the user.
- Throws on unauthenticated.

Example:
```ts
import { toggleTodo } from '@/app/actions/todoActions';
await toggleTodo(123, true);
```

### deleteTodo(id: number): Promise<void>
- Deletes a todo belonging to the user.
- Throws on unauthenticated.

Example:
```ts
import { deleteTodo } from '@/app/actions/todoActions';
await deleteTodo(123);
```

### Data Model (DB)
- Table: `todos` defined in `src/app/db/schema.ts`
  - `id: serial` primary key
  - `task: text`
  - `isComplete: boolean` default false
  - `ownerId: text` required
  - `insertedAt: timestamp` default now()

