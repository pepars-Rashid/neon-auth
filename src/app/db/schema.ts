import { pgTable, bigint, text, boolean, timestamp, serial } from "drizzle-orm/pg-core";

// Introspected Neon Auth table placeholder type definitions for reference
export const usersSync = pgTable("users_sync", {
	id: text("id").primaryKey(),
	name: text("name"),
	email: text("email"),
}, (t) => ({
	schema: "neon_auth",
} as any));

export const todos = pgTable("todos", {
	id: serial("id").primaryKey(),
	task: text("task").notNull(),
	isComplete: boolean("is_complete").notNull().default(false),
	ownerId: text("owner_id").notNull(),
	insertedAt: timestamp("inserted_at", { withTimezone: true }).defaultNow().notNull(),
}); 