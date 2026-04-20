CREATE TABLE IF NOT EXISTS "hyper-recipes_recipe_step_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"recipe_id" integer NOT NULL,
	"step_index" integer NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper-recipes_recipe_user_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"recipe_id" integer NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_recipe_step_notes" ADD CONSTRAINT "hyper-recipes_recipe_step_notes_recipe_id_hyper-recipes_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."hyper-recipes_recipes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_recipe_user_notes" ADD CONSTRAINT "hyper-recipes_recipe_user_notes_recipe_id_hyper-recipes_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."hyper-recipes_recipes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "step_notes_user_recipe_step_idx" ON "hyper-recipes_recipe_step_notes" USING btree ("user_id","recipe_id","step_index");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_notes_user_recipe_idx" ON "hyper-recipes_recipe_user_notes" USING btree ("user_id","recipe_id");