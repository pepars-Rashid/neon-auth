## Components

### `Loading`
- Path: `src/components/Loading.tsx`
- Props:
  - `label?: string` (default `'Loading...'`)
  - `size?: number` (spinner size in px, default `32`)
  - `className?: string`

Example:
```tsx
import Loading from '@/components/Loading';

export default function Page() {
  return (
    <div className="min-h-screen grid place-items-center">
      <Loading label="Fetching data..." size={40} />
    </div>
  );
}
```

### `StoreProvider`
- Path: `src/app/StoreProvider.tsx`
- Purpose: Provides Redux store to the subtree. Optionally hydrates with initial todos.
- Props:
  - `initialTodos?: Todo[]`
  - `children: React.ReactNode`

Example:
```tsx
import StoreProvider from '@/app/StoreProvider';

export default function App({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}
```

### `TodoClient`
- Path: `src/app/TodoClient.tsx`
- Purpose: Authenticated UI for managing todos with Redux thunks.
- Notes: Expects `StoreProvider` up the tree and `StackProvider` in the layout.

