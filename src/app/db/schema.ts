import { pgTable, text, boolean, timestamp, serial } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
	id: serial("id").primaryKey(),
	task: text("task").notNull(),
	isComplete: boolean("is_complete").notNull().default(false),
	ownerId: text("owner_id").notNull(),
	insertedAt: timestamp("inserted_at", { withTimezone: true }).defaultNow().notNull(),
}); 