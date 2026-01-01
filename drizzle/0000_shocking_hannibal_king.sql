DO $$ BEGIN
 CREATE TYPE "public"."tag_types" AS ENUM('Cuisine', 'Meal', 'Diet');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper-recipes_tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag_types" "tag_types" NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper-recipes_favorite_recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"recipe_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper-recipes_recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"description" varchar(1024) NOT NULL,
	"hero_image_id" integer,
	"steps" json,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp,
	"published" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper-recipes_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"url" varchar(1024) NOT NULL,
	"userId" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper-recipes_ingredients" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(1024)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper-recipes_recipes_to_tags" (
	"recipe_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "hyper-recipes_recipes_to_tags_recipe_id_tag_id_pk" PRIMARY KEY("recipe_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper-recipes_recipe_ingredients" (
	"recipe_id" integer NOT NULL,
	"ingredient_id" integer NOT NULL,
	"quantity" varchar(256) NOT NULL,
	CONSTRAINT "hyper-recipes_recipe_ingredients_recipe_id_ingredient_id_pk" PRIMARY KEY("recipe_id","ingredient_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper-recipes_achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"earned_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper-recipes_badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"badge_name" text NOT NULL,
	"earned_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper-recipes_points" (
	"user_id" text NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"xp_for_current_level" integer DEFAULT 0 NOT NULL,
	"next_level_xp" integer DEFAULT 100 NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_favorite_recipes" ADD CONSTRAINT "hyper-recipes_favorite_recipes_recipe_id_hyper-recipes_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."hyper-recipes_recipes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_recipes" ADD CONSTRAINT "hyper-recipes_recipes_hero_image_id_hyper-recipes_images_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."hyper-recipes_images"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_recipes_to_tags" ADD CONSTRAINT "hyper-recipes_recipes_to_tags_recipe_id_hyper-recipes_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."hyper-recipes_recipes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_recipes_to_tags" ADD CONSTRAINT "hyper-recipes_recipes_to_tags_tag_id_hyper-recipes_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."hyper-recipes_tag"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_recipe_ingredients" ADD CONSTRAINT "hyper-recipes_recipe_ingredients_recipe_id_hyper-recipes_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."hyper-recipes_recipes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_recipe_ingredients" ADD CONSTRAINT "hyper-recipes_recipe_ingredients_ingredient_id_hyper-recipes_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."hyper-recipes_ingredients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "favorites_user_recipe_idx" ON "hyper-recipes_favorite_recipes" USING btree ("user_id","recipe_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_index" ON "hyper-recipes_recipes" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "slug_index" ON "hyper-recipes_recipes" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recipes_to_tags_tag_idx" ON "hyper-recipes_recipes_to_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "achievements_user_id_idx" ON "hyper-recipes_achievements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "badges_user_id_idx" ON "hyper-recipes_badges" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "points_user_id_idx" ON "hyper-recipes_points" USING btree ("user_id");