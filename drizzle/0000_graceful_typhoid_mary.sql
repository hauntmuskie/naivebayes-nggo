CREATE SCHEMA "naive_bayes_app";
--> statement-breakpoint
CREATE TYPE "naive_bayes_app"."dataset_type" AS ENUM('training', 'testing', 'validation');--> statement-breakpoint
CREATE TABLE "naive_bayes_app"."classification_history" (
	"id" text PRIMARY KEY NOT NULL,
	"file_name" text NOT NULL,
	"model_name" text NOT NULL,
	"total_records" integer NOT NULL,
	"accuracy" real,
	"results" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "naive_bayes_app"."classifications" (
	"id" text PRIMARY KEY NOT NULL,
	"model_id" text NOT NULL,
	"data" text NOT NULL,
	"predicted_class" text NOT NULL,
	"actual_class" text,
	"confidence" real NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "naive_bayes_app"."dataset_records" (
	"id" text PRIMARY KEY NOT NULL,
	"record_id" text NOT NULL,
	"file_name" text NOT NULL,
	"dataset_type" "naive_bayes_app"."dataset_type" NOT NULL,
	"raw_data" json NOT NULL,
	"columns" json NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "naive_bayes_app"."model_metrics" (
	"id" text PRIMARY KEY NOT NULL,
	"model_id" text NOT NULL,
	"accuracy" real NOT NULL,
	"precision" real NOT NULL,
	"recall" real NOT NULL,
	"f1_score" real NOT NULL,
	"class_metrics" json NOT NULL,
	"confusion_matrix" json,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "naive_bayes_app"."models" (
	"id" text PRIMARY KEY NOT NULL,
	"model_name" text NOT NULL,
	"target_column" text NOT NULL,
	"feature_columns" json NOT NULL,
	"classes" json NOT NULL,
	"accuracy" real NOT NULL,
	"model_data" text NOT NULL,
	"encoders_data" text NOT NULL,
	"label_encoder_data" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "naive_bayes_app"."classifications" ADD CONSTRAINT "classifications_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "naive_bayes_app"."models"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "naive_bayes_app"."model_metrics" ADD CONSTRAINT "model_metrics_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "naive_bayes_app"."models"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "classification_history_date_idx" ON "naive_bayes_app"."classification_history" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "classification_history_model_idx" ON "naive_bayes_app"."classification_history" USING btree ("model_name");--> statement-breakpoint
CREATE INDEX "classifications_model_date_idx" ON "naive_bayes_app"."classifications" USING btree ("model_id","created_at");--> statement-breakpoint
CREATE INDEX "dataset_file_type_idx" ON "naive_bayes_app"."dataset_records" USING btree ("file_name","dataset_type");--> statement-breakpoint
CREATE UNIQUE INDEX "dataset_record_unique_idx" ON "naive_bayes_app"."dataset_records" USING btree ("record_id","file_name");--> statement-breakpoint
CREATE INDEX "model_metrics_model_idx" ON "naive_bayes_app"."model_metrics" USING btree ("model_id");--> statement-breakpoint
CREATE UNIQUE INDEX "model_name_idx" ON "naive_bayes_app"."models" USING btree ("model_name");