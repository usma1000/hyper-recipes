import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";

import * as schema from "./schemas";

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql, { schema });