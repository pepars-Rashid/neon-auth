import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";

export const db = drizzle(process.env.DATABASE_URL!); 