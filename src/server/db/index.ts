import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { type Logger } from "drizzle-orm";

import * as schema from "./schemas";

/**
 * Custom logger for Drizzle ORM queries.
 * Logs queries in development mode for debugging.
 * In production, queries are tracked via Sentry spans.
 */
class QueryLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    if (process.env.NODE_ENV === "development") {
      console.log("[DB Query]:", query);
      if (params.length > 0) {
        console.log("[DB Params]:", params);
      }
    }
  }
}

/**
 * Drizzle ORM database instance configured with schema and logging.
 * - Development: Logs all queries to console for debugging
 * - Production: Minimal logging, use Sentry for performance tracking
 */
export const db = drizzle(sql, {
  schema,
  logger: new QueryLogger(),
});