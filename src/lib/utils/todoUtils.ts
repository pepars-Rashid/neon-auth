interface DatabaseTodo {
  id: number;
  task: string;
  isComplete: boolean;
  insertedAt: Date | string;
}

// Utility function to normalize todo data from database
export const normalizeTodo = (todo: DatabaseTodo) => ({
  id: todo.id,
  task: todo.task,
  isComplete: todo.isComplete,
  insertedAt: todo.insertedAt instanceof Date 
    ? todo.insertedAt.toISOString() 
    : typeof todo.insertedAt === 'string' 
      ? todo.insertedAt 
      : new Date(todo.insertedAt).toISOString()
});

// Utility function to normalize an array of todos
export const normalizeTodos = (todos: DatabaseTodo[]) => {
  return Array.isArray(todos) ? todos.map(normalizeTodo) : [];
};
