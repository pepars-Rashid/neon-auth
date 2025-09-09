# 🚀 Neon Auth + Redux Todo App - Setup & Architecture Guide

A modern, full-stack Todo application built with **Next.js 15**, **Neon Auth**, **PostgreSQL**, and **Redux Toolkit**, featuring a beautiful UI and robust state management.

## 📋 Table of Contents
- [🏗️ Project Overview](#️-project-overview)
- [🛠️ Technology Stack](#️-technology-stack)
- [⚙️ Setup Instructions](#️-setup-instructions)
- [🏛️ Architecture Overview](#️-architecture-overview)
- [🔄 Redux State Management](#-redux-state-management)
- [📡 Data Fetching Strategy](#-data-fetching-strategy)
- [🎨 UI Components](#-ui-components)
- [🔐 Authentication Flow](#-authentication-flow)
- [📁 Project Structure](#-project-structure)
- [🚀 Deployment](#-deployment)
 - [📚 Documentation](#-documentation)

## 🏗️ Project Overview

This is a production-ready Todo application that demonstrates:
- **Authentication** using Neon Auth (Stack Framework)
- **State Management** with Redux Toolkit
- **Database Operations** with Drizzle ORM + Neon PostgreSQL
- **Modern UI** with Tailwind CSS and custom components
- **Server Actions** for secure backend operations
- **Type Safety** throughout the application

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | Next.js 15 | React framework with App Router |
| **Authentication** | Neon Auth (Stack) | User authentication & session management |
| **State Management** | Redux Toolkit | Client-side state management |
| **Database** | Neon PostgreSQL | Cloud PostgreSQL database |
| **ORM** | Drizzle ORM | Type-safe database operations |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Language** | TypeScript | Type safety and better DX |

## ⚙️ Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the project root:

```env
# Neon Auth Configuration
NEXT_PUBLIC_STACK_PROJECT_ID=your_stack_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
STACK_SECRET_SERVER_KEY=your_secret_key

# Neon Database
DATABASE_URL=postgresql://username:password@host/database
```

### 2. Database Setup

The application uses Drizzle ORM with the following schema:

```sql
-- Users table (managed by Neon Auth)
CREATE SCHEMA neon_auth;

-- Todos table
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  is_complete BOOLEAN NOT NULL DEFAULT false,
  owner_id TEXT NOT NULL,
  inserted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

### 3. Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### 4. First Time Setup

1. Visit `http://localhost:3000/handler/sign-up` to create an account
2. Return to `http://localhost:3000` to access the Todo app
3. Start managing your todos!

## 🏛️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          Client Side                            │
├─────────────────────────────────────────────────────────────────┤
│  React Components  │  Redux Store  │  Stack Auth Client        │
│  - TodoClient      │  - todoSlice  │  - useUser()              │
│  - StoreProvider   │  - store.ts   │  - UserButton             │
│  - Loading         │  - hooks.ts   │                           │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Server Actions
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                          Server Side                            │
├─────────────────────────────────────────────────────────────────┤
│  Server Actions    │  Database     │  Authentication           │
│  - todoActions.ts  │  - Drizzle    │  - Stack Server App       │
│  - CRUD operations │  - Neon DB    │  - Session validation     │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Redux State Management

### Store Configuration

```typescript
// src/lib/store.ts
export const makeStore = () => {
  return configureStore({
    reducer: {
      todos: todosReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
  });
};
```

### State Structure

```typescript
interface TodosState {
  items: Todo[];                    // Array of todo items
  status: 'idle' | 'pending' | 'succeeded' | 'failed';       // Main loading state
  error: string | null;             // Error messages
  addStatus: 'idle' | 'pending' | 'succeeded' | 'failed';    // Add operation state
  updateStatus: 'idle' | 'pending' | 'succeeded' | 'failed'; // Update operation state
  deleteStatus: 'idle' | 'pending' | 'succeeded' | 'failed'; // Delete operation state
}

interface Todo {
  id: number;
  task: string;
  isComplete: boolean;
  insertedAt: string;  // ISO string for serialization
}
```

### Redux Actions (Async Thunks)

| Action | Purpose | Server Action Called |
|--------|---------|---------------------|
| `fetchTodos` | Load all user todos | `getTodos()` |
| `addTodoAsync` | Create new todo | `addTodo()` → `getTodos()` |
| `toggleTodoAsync` | Toggle completion status | `toggleTodo()` → `getTodos()` |
| `deleteTodoAsync` | Delete todo | `deleteTodo()` → `getTodos()` |

### Key Redux Features

1. **Async Thunks**: All database operations are async thunks
2. **Separate Loading States**: Each operation (add, update, delete) has its own loading state
3. **Error Handling**: Comprehensive error states with auto-dismiss
4. **Data Normalization**: Date objects converted to ISO strings for serialization
5. **Optimistic Updates**: UI updates immediately, then syncs with server

## 📡 Data Fetching Strategy

### 1. Initial Data Loading

```typescript
// src/app/page.tsx - Server-side initial fetch
useEffect(() => {
  const fetchTodos = async () => {
    const todos = await getTodos();
    const normalizedTodos = normalizeTodos(todos);
    setInitialTodos(normalizedTodos);
  };
  fetchTodos();
}, []);
```

### 2. Redux Store Hydration

```typescript
// src/app/StoreProvider.tsx - Initialize store with server data
if (!storeRef.current) {
  storeRef.current = makeStore();
  if (initialTodos) {
    storeRef.current.dispatch({ type: 'todos/setTodos', payload: initialTodos });
  }
}
```

### 3. Client-side Operations

```typescript
// src/app/TodoClient.tsx - Redux-powered CRUD operations
const handleAddTodo = async () => {
  await dispatch(addTodoAsync(task.trim())).unwrap();
};

const handleToggleTodo = async (id, isComplete) => {
  await dispatch(toggleTodoAsync({ id, isComplete })).unwrap();
};

const handleDeleteTodo = async (id) => {
  await dispatch(deleteTodoAsync(id)).unwrap();
};
```

### 4. Server Actions (Backend)

```typescript
// src/app/actions/todoActions.ts - Secure server operations
export async function addTodo(task: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error('Not authenticated');
  await db.insert(todos).values({ task, ownerId: user.id });
}
```

## 🎨 UI Components

### Component Hierarchy

```
App Layout (layout.tsx)
└── StackProvider (Authentication Context)
    └── Home Page (page.tsx)
        └── StoreProvider (Redux Context)
            └── TodoClient (Main App Component)
                ├── Header with UserButton
                ├── Add Todo Form
                ├── Error Display
                ├── Todo List with CRUD operations
                └── Statistics Footer
```

### Key UI Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Loading States**: Individual spinners for each operation
- **Error Handling**: User-friendly error messages with auto-dismiss
- **Empty States**: Helpful messaging when no todos exist
- **Statistics**: Real-time todo counts (total, completed, remaining)
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🔐 Authentication Flow

### 1. Authentication Check

```typescript
// TodoClient checks user authentication
const user = useUser();
if (!user) {
  // Show sign-in/sign-up UI
  return <AuthenticationPrompt />;
}
```

### 2. Server-side Authorization

```typescript
// Every server action validates user session
export async function getTodos() {
  const user = await stackServerApp.getUser();
  if (!user) return [];
  return db.select().from(todos)
    .where(eq(todos.ownerId, user.id));
}
```

### 3. Data Isolation

- Each user only sees their own todos
- All database queries filtered by `ownerId`
- Server validates ownership on all operations

## 📁 Project Structure

```
neon-auth/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 actions/            # Server Actions
│   │   │   └── todoActions.ts     # CRUD operations
│   │   ├── 📁 db/                 # Database configuration
│   │   │   ├── index.ts           # DB connection
│   │   │   └── schema.ts          # Drizzle schema
│   │   ├── StoreProvider.tsx      # Redux provider
│   │   ├── TodoClient.tsx         # Main app component
│   │   ├── layout.tsx             # Root layout with auth
│   │   ├── page.tsx               # Home page
│   │   └── globals.css            # Global styles
│   ├── 📁 components/             # Reusable components
│   │   └── Loading.tsx            # Loading spinner
│   ├── 📁 lib/                    # Core utilities
│   │   ├── 📁 features/           # Redux slices
│   │   │   └── 📁 todos/
│   │   │       └── todosSlice.ts  # Todo state management
│   │   ├── 📁 utils/              # Utility functions
│   │   │   └── todoUtils.ts       # Data normalization
│   │   ├── hooks.ts               # Typed Redux hooks
│   │   └── store.ts               # Redux store config
│   └── stack.ts                   # Stack Auth configuration
├── 📄 drizzle.config.ts          # Database configuration
├── 📄 package.json               # Dependencies
├── 📄 tailwind.config.js         # Tailwind configuration
└── 📄 tsconfig.json              # TypeScript configuration
```

## 🚀 Deployment

### Environment Variables Required

```bash
NEXT_PUBLIC_STACK_PROJECT_ID=
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=
STACK_SECRET_SERVER_KEY=
DATABASE_URL=
```

### Build Commands

```bash
npm run build    # Build the application
npm start        # Start production server
```

### Deployment Platforms

- **Vercel**: Recommended (native Next.js support)
- **Netlify**: Full-stack support
- **Railway**: Easy database + app deployment
- **DigitalOcean App Platform**: Cost-effective option

## 📝 Development Notes

### Data Serialization

- **Problem**: Database returns Date objects, Redux requires serializable state
- **Solution**: `normalizeTodo()` utility converts dates to ISO strings
- **Implementation**: Applied in all data entry points to Redux

### Error Handling Strategy

1. **Server Actions**: Throw meaningful errors
2. **Redux Thunks**: Catch and normalize errors
3. **UI Components**: Display user-friendly messages
4. **Auto-dismiss**: Errors clear after 5 seconds

### Performance Optimizations

- **Selective Re-renders**: useSelector with specific state slices
- **Async Thunks**: Non-blocking UI operations
- **Server-side Initial Load**: Faster perceived performance
- **Loading States**: Prevent duplicate operations

### Type Safety

- **End-to-end TypeScript**: From database to UI components
- **Typed Redux Hooks**: useAppSelector, useAppDispatch
- **Schema Validation**: Drizzle ORM ensures data integrity
- **Server Action Types**: Proper typing for all operations

This setup provides a robust, scalable foundation for a modern todo application with excellent user experience and developer ergonomics! 🎉

## 📚 Documentation

Comprehensive docs live in `docs/`:

- `docs/index.md` — overview and links
- `docs/apis.md` — server actions API
- `docs/redux.md` — Redux slice, store, hooks, and state shape
- `docs/components.md` — public components and props
- `docs/utils.md` — utility helpers
