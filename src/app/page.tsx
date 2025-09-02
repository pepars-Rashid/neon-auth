"use client";
import { useEffect, useState, useTransition } from "react";
import { useUser, UserButton } from "@stackframe/stack";
import { addTodo, deleteTodo, getTodos, toggleTodo } from "@/app/actions/todoActions";

export default function Home() {
	const user = useUser();
	const [todos, setTodos] = useState<Array<{ id: number; task: string; isComplete: boolean }>>([]);
	const [task, setTask] = useState("");
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		startTransition(async () => {
			const items = await getTodos();
			setTodos(items as any);
		});
	}, [user?.id]);

	async function onAdd(e: React.FormEvent) {
		e.preventDefault();
		if (!task.trim()) return;
		await addTodo(task.trim());
		setTask("");
		const items = await getTodos();
		setTodos(items as any);
	}

	async function onToggle(id: number, isComplete: boolean) {
		await toggleTodo(id, !isComplete);
		const items = await getTodos();
		setTodos(items as any);
	}

	async function onDelete(id: number) {
		await deleteTodo(id);
		const items = await getTodos();
		setTodos(items as any);
	}

	return (
		<div className="max-w-xl mx-auto py-12">
			<header className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold">Neon Auth Todos</h1>
				{user ? (
					<UserButton />
				) : (
					<div className="flex gap-3 text-sm">
						<a className="underline" href="/handler/sign-in">Sign In</a>
						<a className="underline" href="/handler/sign-up">Sign Up</a>
					</div>
				)}
			</header>
			{user ? (
				<>
					<form onSubmit={onAdd} className="flex gap-2 mb-4">
						<input value={task} onChange={(e) => setTask(e.target.value)} placeholder="Add a task" className="flex-1 border px-3 py-2 rounded" />
						<button disabled={isPending} className="px-4 py-2 rounded bg-black text-white">Add</button>
					</form>
					<ul className="space-y-2">
						{todos.map((t) => (
							<li key={t.id} className="flex items-center justify-between border rounded px-3 py-2">
								<label className="flex items-center gap-2">
									<input type="checkbox" checked={t.isComplete} onChange={() => onToggle(t.id, t.isComplete)} />
									<span className={t.isComplete ? "line-through" : ""}>{t.task}</span>
								</label>
								<button className="text-sm text-red-600" onClick={() => onDelete(t.id)}>Delete</button>
							</li>
						))}
					</ul>
				</>
			) : (
				<p className="text-sm">Please sign in to manage your todos.</p>
			)}
		</div>
	);
}
