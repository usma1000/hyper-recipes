CREATE TABLE IF NOT EXISTS "hyper-recipes_cooking_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_id" integer NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"rating" real NOT NULL,
	"time_minutes" integer NOT NULL,
	"notes" text,
	"cooked_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_cooking_sessions" ADD CONSTRAINT "hyper-recipes_cooking_sessions_recipe_id_hyper-recipes_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."hyper-recipes_recipes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cooking_sessions_recipe_id_idx" ON "hyper-recipes_cooking_sessions" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cooking_sessions_user_id_idx" ON "hyper-recipes_cooking_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cooking_sessions_user_recipe_idx" ON "hyper-recipes_cooking_sessions" USING btree ("user_id","recipe_id");