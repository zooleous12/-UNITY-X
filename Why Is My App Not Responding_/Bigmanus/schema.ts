  transcription: text("transcription"),
  summary: text("summary"),
  keyPoints: json("keyPoints").$type<string[]>(),
  definitions: json("definitions").$type<Array<{ term: string; definition: string }>>(),
  timestamps: json("timestamps").$type<Array<{ time: number; text: string; isKeyPoint: boolean }>>(),
  
  // Study metadata
  subject: varchar("subject", { length: 100 }),
  course: varchar("course", { length: 200 }),
  tags: json("tags").$type<string[]>(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StudyMaterial = typeof studyMaterials.$inferSelect;
export type InsertStudyMaterial = typeof studyMaterials.$inferInsert;

// ============================================================================
// FLASHCARDS
// ============================================================================

export const flashcards = mysqlTable("flashcards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId"), // optional - can be null
  studyMaterialId: int("studyMaterialId"), // optional - can be standalone
  
  front: text("front").notNull(),
  back: text("back").notNull(),
  
  // Spaced repetition data
  easeFactor: float("easeFactor").default(2.5).notNull(),
  interval: int("interval").default(0).notNull(), // days
  repetitions: int("repetitions").default(0).notNull(),
  nextReviewAt: timestamp("nextReviewAt").defaultNow().notNull(),
  lastReviewedAt: timestamp("lastReviewedAt"),
  
  // Performance tracking
  correctCount: int("correctCount").default(0).notNull(),
  incorrectCount: int("incorrectCount").default(0).notNull(),
  
  // Metadata
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("medium").notNull(),
  tags: json("tags").$type<string[]>(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Flashcard = typeof flashcards.$inferSelect;
export type InsertFlashcard = typeof flashcards.$inferInsert;

// ============================================================================
// WEAKNESS ANALYSIS
// ============================================================================

export const weaknessAnalyses = mysqlTable("weakness_analyses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),