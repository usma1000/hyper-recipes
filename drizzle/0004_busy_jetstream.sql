DO $$ BEGIN
 CREATE TYPE "public"."difficulty_level" AS ENUM('EASY', 'MEDIUM', 'HARD');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."skill_level" AS ENUM('beginner', 'intermediate', 'advanced');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."scaling_rule_type" AS ENUM('linear', 'fixed', 'step');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."ingredient_override_operation" AS ENUM('ADD', 'REMOVE', 'UPDATE', 'REPLACE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."step_override_operation" AS ENUM('ADD', 'REMOVE', 'UPDATE', 'REPLACE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper-recipes_recipe_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_id" integer NOT NULL,
	"difficulty" "difficulty_level" NOT NULL,
	"is_base" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper-recipes_recipe_steps" (
	"id" serial PRIMARY KEY NOT NULL,
	"version_id" integer NOT NULL,
	"step_order" integer NOT NULL,
	"instruction" text NOT NULL,
	"media_url" varchar(512),
	"timer_seconds" integer,
	"skill_level" "skill_level",
	"tools" json,
	"techniques" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper-recipes_version_ingredients" (
	"id" serial PRIMARY KEY NOT NULL,
	"version_id" integer NOT NULL,
	"ingredient_id" integer NOT NULL,
	"quantity" numeric(10, 3) NOT NULL,
	"unit" varchar(50) NOT NULL,
	"notes" text,
	"is_optional" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper-recipes_ingredient_substitutions" (
	"id" serial PRIMARY KEY NOT NULL,
	"version_ingredient_id" integer NOT NULL,
	"substitute_ingredient_id" integer NOT NULL,
	"substitute_quantity" numeric(10, 3) NOT NULL,
	"substitute_unit" varchar(50) NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper-recipes_scaling_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"version_ingredient_id" integer NOT NULL,
	"rule_type" "scaling_rule_type" NOT NULL,
	"factor" numeric(10, 4),
	"min_servings" integer,
	"max_servings" integer,
	"step_size" numeric(10, 3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper-recipes_ingredient_overrides" (
	"id" serial PRIMARY KEY NOT NULL,
	"version_id" integer NOT NULL,
	"operation" "ingredient_override_operation" NOT NULL,
	"target_ingredient_id" integer,
	"override_data" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hyper-recipes_step_overrides" (
	"id" serial PRIMARY KEY NOT NULL,
	"version_id" integer NOT NULL,
	"operation" "step_override_operation" NOT NULL,
	"target_step_id" integer,
	"override_data" json
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_recipe_versions" ADD CONSTRAINT "hyper-recipes_recipe_versions_recipe_id_hyper-recipes_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."hyper-recipes_recipes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_recipe_steps" ADD CONSTRAINT "hyper-recipes_recipe_steps_version_id_hyper-recipes_recipe_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."hyper-recipes_recipe_versions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_version_ingredients" ADD CONSTRAINT "hyper-recipes_version_ingredients_version_id_hyper-recipes_recipe_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."hyper-recipes_recipe_versions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_version_ingredients" ADD CONSTRAINT "hyper-recipes_version_ingredients_ingredient_id_hyper-recipes_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."hyper-recipes_ingredients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_ingredient_substitutions" ADD CONSTRAINT "hyper-recipes_ingredient_substitutions_version_ingredient_id_hyper-recipes_version_ingredients_id_fk" FOREIGN KEY ("version_ingredient_id") REFERENCES "public"."hyper-recipes_version_ingredients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_ingredient_substitutions" ADD CONSTRAINT "hyper-recipes_ingredient_substitutions_substitute_ingredient_id_hyper-recipes_ingredients_id_fk" FOREIGN KEY ("substitute_ingredient_id") REFERENCES "public"."hyper-recipes_ingredients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_scaling_rules" ADD CONSTRAINT "hyper-recipes_scaling_rules_version_ingredient_id_hyper-recipes_version_ingredients_id_fk" FOREIGN KEY ("version_ingredient_id") REFERENCES "public"."hyper-recipes_version_ingredients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_ingredient_overrides" ADD CONSTRAINT "hyper-recipes_ingredient_overrides_version_id_hyper-recipes_recipe_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."hyper-recipes_recipe_versions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_ingredient_overrides" ADD CONSTRAINT "hyper-recipes_ingredient_overrides_target_ingredient_id_hyper-recipes_version_ingredients_id_fk" FOREIGN KEY ("target_ingredient_id") REFERENCES "public"."hyper-recipes_version_ingredients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_step_overrides" ADD CONSTRAINT "hyper-recipes_step_overrides_version_id_hyper-recipes_recipe_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."hyper-recipes_recipe_versions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hyper-recipes_step_overrides" ADD CONSTRAINT "hyper-recipes_step_overrides_target_step_id_hyper-recipes_recipe_steps_id_fk" FOREIGN KEY ("target_step_id") REFERENCES "public"."hyper-recipes_recipe_steps"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
