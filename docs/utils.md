## Utilities

### `normalizeTodo`
- Path: `src/lib/utils/todoUtils.ts`
- Signature: `(todo: { id: number; task: string; isComplete: boolean; insertedAt: Date | string; }) => { id: number; task: string; isComplete: boolean; insertedAt: string; }`
- Purpose: Ensures `insertedAt` is always an ISO string for Redux serializability.

Example:
```ts
import { normalizeTodo } from '@/lib/utils/todoUtils';
const normalized = normalizeTodo({ id: 1, task: 'x', isComplete: false, insertedAt: new Date() });
```

### `normalizeTodos`
- Path: `src/lib/utils/todoUtils.ts`
- Signature: `(todos: DatabaseTodo[]) => Todo[]`
- Purpose: Normalizes an array defensively, returning `[]` if input is not an array.

Example:
```ts
import { normalizeTodos } from '@/lib/utils/todoUtils';
const todos = normalizeTodos(await getTodos());
```

