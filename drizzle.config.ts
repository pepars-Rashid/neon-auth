import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
config({ path: "./.env.local" });

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/app/db/schema.ts",
	out: "./drizzle",
	dbCredentials: { url: process.env.DATABASE_URL! },
	schemaFilter: ["public", "neon_auth"],
}); 