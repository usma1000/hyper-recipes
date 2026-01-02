CREATE TABLE IF NOT EXISTS "hyper-recipes_collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper-recipes_collection_recipes" (
	"collection_id" integer NOT NULL,
	"recipe_id" integer NOT NULL,
	CONSTRAINT "hyper-recipes_collection_recipes_collection_id_recipe_id_pk" PRIMARY KEY("collection_id","recipe_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_collection_recipes" ADD CONSTRAINT "hyper-recipes_collection_recipes_collection_id_hyper-recipes_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."hyper-recipes_collections"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_collection_recipes" ADD CONSTRAINT "hyper-recipes_collection_recipes_recipe_id_hyper-recipes_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."hyper-recipes_recipes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "collection_recipes_collection_idx" ON "hyper-recipes_collection_recipes" USING btree ("collection_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "collection_recipes_recipe_idx" ON "hyper-recipes_collection_recipes" USING btree ("recipe_id");