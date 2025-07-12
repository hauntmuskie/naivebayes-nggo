import { relations } from "drizzle-orm";
import {
  pgSchema,
  text,
  integer,
  real,
  timestamp,
  json,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const naiveBayesSchema = pgSchema("naive_bayes_app");

export const datasetTypeEnum = naiveBayesSchema.enum("dataset_type", [
  "training",
  "testing",
  "validation",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
};

const baseId = {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
};

export const models = naiveBayesSchema.table(
  "models",
  {
    ...baseId,
    modelName: text("model_name").notNull(),
    targetColumn: text("target_column").notNull(),
    featureColumns: json("feature_columns").$type<string[]>().notNull(),
    classes: json("classes").$type<string[]>().notNull(),
    accuracy: real("accuracy").notNull(),
    modelData: text("model_data").notNull(),
    encodersData: text("encoders_data").notNull(),
    labelEncoderData: text("label_encoder_data").notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("model_name_idx").on(table.modelName)]
);

export const classifications = naiveBayesSchema.table(
  "classifications",
  {
    ...baseId,
    modelId: text("model_id")
      .notNull()
      .references(() => models.id, { onDelete: "cascade" }),
    data: text("data").notNull(),
    predictedClass: text("predicted_class").notNull(),
    actualClass: text("actual_class"),
    confidence: real("confidence").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("classifications_model_date_idx").on(table.modelId, table.createdAt),
  ]
);

export const modelMetrics = naiveBayesSchema.table(
  "model_metrics",
  {
    ...baseId,
    modelId: text("model_id")
      .notNull()
      .references(() => models.id, { onDelete: "cascade" }),
    accuracy: real("accuracy").notNull(),
    precision: real("precision").notNull(),
    recall: real("recall").notNull(),
    f1Score: real("f1_score").notNull(),
    classMetrics: json("class_metrics").$type<Record<string, any>>().notNull(),
    confusionMatrix: json("confusion_matrix").$type<number[][]>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("model_metrics_model_idx").on(table.modelId)]
);

export const classificationHistory = naiveBayesSchema.table(
  "classification_history",
  {
    ...baseId,
    fileName: text("file_name").notNull(),
    modelName: text("model_name").notNull(),
    totalRecords: integer("total_records").notNull(),
    accuracy: real("accuracy"),
    results: text("results").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("classification_history_date_idx").on(table.createdAt),
    index("classification_history_model_idx").on(table.modelName),
  ]
);

export const datasetRecords = naiveBayesSchema.table(
  "dataset_records",
  {
    ...baseId,
    recordId: text("record_id").notNull(),
    fileName: text("file_name").notNull(),
    datasetType: datasetTypeEnum("dataset_type").notNull(),
    rawData: json("raw_data").$type<Record<string, any>>().notNull(),
    columns: json("columns").$type<string[]>().notNull(),
    ...timestamps,
  },
  (table) => [
    index("dataset_file_type_idx").on(table.fileName, table.datasetType),
    uniqueIndex("dataset_record_unique_idx").on(table.recordId, table.fileName),
  ]
);

export const modelsRelations = relations(models, ({ many }) => ({
  classifications: many(classifications),
  metrics: many(modelMetrics),
}));

export const classificationsRelations = relations(
  classifications,
  ({ one }) => ({
    model: one(models, {
      fields: [classifications.modelId],
      references: [models.id],
    }),
  })
);

export const modelMetricsRelations = relations(modelMetrics, ({ one }) => ({
  model: one(models, {
    fields: [modelMetrics.modelId],
    references: [models.id],
  }),
}));

export type ModelsInsert = typeof models.$inferInsert;
export type ClassificationsInsert = typeof classifications.$inferInsert;
export type ModelMetricsInsert = typeof modelMetrics.$inferInsert;
export type ClassificationHistoryInsert =
  typeof classificationHistory.$inferInsert;
export type DatasetRecordsInsert = typeof datasetRecords.$inferInsert;

export type ModelsSelect = typeof models.$inferSelect;
export type ClassificationsSelect = typeof classifications.$inferSelect;
export type ModelMetricsSelect = typeof modelMetrics.$inferSelect;
export type ClassificationHistorySelect =
  typeof classificationHistory.$inferSelect;
export type DatasetRecordsSelect = typeof datasetRecords.$inferSelect;

export type ModelsWithMetrics = ModelsSelect & {
  metrics: ModelMetricsSelect[];
  classifications: ClassificationsSelect[];
};

export type ModelsWithRelations = ModelsSelect & {
  metrics: ModelMetricsSelect[];
};
