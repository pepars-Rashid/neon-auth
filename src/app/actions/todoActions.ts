'use server';
import { db } from '@/app/db';
import { todos } from '@/app/db/schema';
import { stackServerApp } from '@/stack';
import { and, desc, eq } from 'drizzle-orm';

export async function addTodo(task: string) {
	const user = await stackServerApp.getUser();
	if (!user) throw new Error('Not authenticated');
	await db.insert(todos).values({ task, ownerId: user.id });
}

export async function getTodos() {
	const user = await stackServerApp.getUser();
	if (!user) return [];
	return db.select().from(todos).where(eq(todos.ownerId, user.id)).orderBy(desc(todos.insertedAt));
}

export async function toggleTodo(id: number, isComplete: boolean) {
	const user = await stackServerApp.getUser();
	if (!user) throw new Error('Not authenticated');
	await db.update(todos).set({ isComplete }).where(and(eq(todos.id, id), eq(todos.ownerId, user.id)));
}

export async function deleteTodo(id: number) {
	const user = await stackServerApp.getUser();
	if (!user) throw new Error('Not authenticated');
	await db.delete(todos).where(and(eq(todos.id, id), eq(todos.ownerId, user.id)));
} 