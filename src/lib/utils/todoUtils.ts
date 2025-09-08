// Utility function to normalize todo data from database
export const normalizeTodo = (todo: any) => ({
  id: todo.id,
  task: todo.task,
  isComplete: todo.isComplete,
  // ownerId: todo.ownerId,
  insertedAt: todo.insertedAt instanceof Date 
    ? todo.insertedAt.toISOString() 
    : typeof todo.insertedAt === 'string' 
      ? todo.insertedAt 
      : new Date(todo.insertedAt).toISOString()
});

// Utility function to normalize an array of todos
export const normalizeTodos = (todos: any[]) => {
  return Array.isArray(todos) ? todos.map(normalizeTodo) : [];
};
