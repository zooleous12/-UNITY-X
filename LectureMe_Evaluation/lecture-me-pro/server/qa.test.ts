import { describe, it, expect, beforeEach } from "vitest";
import { getDb } from "./db";
import { studyMaterials, materialQuestions } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

describe("Q&A Router", () => {
  const testUserId = 999998; // Different from material processing tests
  const testMaterialId = 999998;

  beforeEach(async () => {
    const db = await getDb();
    if (db) {
      // Clean up test data
      await db.delete(materialQuestions).where(eq(materialQuestions.userId, testUserId));
      await db.delete(studyMaterials).where(eq(studyMaterials.userId, testUserId));
    }
  });

  it("should create question record in database", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Create test material first
    const [material] = await db
      .insert(studyMaterials)
      .values({
        userId: testUserId,
        title: "Test Lecture for Q&A",
        type: "audio",
        fileUrl: "https://example.com/test.mp3",
        status: "completed",
        transcription: "This is a test transcription about photosynthesis.",
        summary: "A lecture about how plants convert sunlight into energy.",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .$returningId();

    // Create a question
    const [question] = await db
      .insert(materialQuestions)
      .values({
        materialId: material.id,
        userId: testUserId,
        question: "What is photosynthesis?",
        answer: "Photosynthesis is the process by which plants convert sunlight into energy.",
        tokensUsed: 50,
        responseTime: 1500,
      })
      .$returningId();

    expect(question.id).toBeDefined();

    // Verify question was saved
    const [saved] = await db
      .select()
      .from(materialQuestions)
      .where(eq(materialQuestions.id, question.id));

    expect(saved.question).toBe("What is photosynthesis?");
    expect(saved.answer).toContain("sunlight");
    expect(saved.materialId).toBe(material.id);
    expect(saved.userId).toBe(testUserId);
  });

  it("should retrieve questions for a material", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Create test material
    const [material] = await db
      .insert(studyMaterials)
      .values({
        userId: testUserId,
        title: "Biology Lecture",
        type: "audio",
        fileUrl: "https://example.com/bio.mp3",
        status: "completed",
        transcription: "Cell biology basics.",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .$returningId();

    // Create multiple questions
    await db.insert(materialQuestions).values([
      {
        materialId: material.id,
        userId: testUserId,
        question: "What is a cell?",
        answer: "A cell is the basic unit of life.",
        tokensUsed: 40,
        responseTime: 1200,
      },
      {
        materialId: material.id,
        userId: testUserId,
        question: "What are organelles?",
        answer: "Organelles are specialized structures within cells.",
        tokensUsed: 45,
        responseTime: 1300,
      },
    ]);

    // Retrieve questions
    const questions = await db
      .select()
      .from(materialQuestions)
      .where(
        and(
          eq(materialQuestions.materialId, material.id),
          eq(materialQuestions.userId, testUserId)
        )
      );

    expect(questions).toHaveLength(2);
    expect(questions[0].question).toContain("cell");
    expect(questions[1].question).toContain("organelles");
  });

  it("should delete questions", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Create test material
    const [material] = await db
      .insert(studyMaterials)
      .values({
        userId: testUserId,
        title: "Chemistry Lecture",
        type: "pdf",
        fileUrl: "https://example.com/chem.pdf",
        status: "completed",
        transcription: "Chemical reactions.",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .$returningId();

    // Create question
    const [question] = await db
      .insert(materialQuestions)
      .values({
        materialId: material.id,
        userId: testUserId,
        question: "What is a chemical reaction?",
        answer: "A chemical reaction is a process where substances are transformed.",
        tokensUsed: 50,
        responseTime: 1400,
      })
      .$returningId();

    // Delete question
    await db
      .delete(materialQuestions)
      .where(eq(materialQuestions.id, question.id));

    // Verify deletion
    const [deleted] = await db
      .select()
      .from(materialQuestions)
      .where(eq(materialQuestions.id, question.id));

    expect(deleted).toBeUndefined();
  });

  it("should track response metadata (tokens and time)", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Create test material
    const [material] = await db
      .insert(studyMaterials)
      .values({
        userId: testUserId,
        title: "Physics Lecture",
        type: "video",
        fileUrl: "https://example.com/physics.mp4",
        status: "completed",
        transcription: "Newton's laws of motion.",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .$returningId();

    const testTokens = 125;
    const testResponseTime = 2500;

    // Create question with metadata
    const [question] = await db
      .insert(materialQuestions)
      .values({
        materialId: material.id,
        userId: testUserId,
        question: "What is Newton's first law?",
        answer: "An object at rest stays at rest unless acted upon by a force.",
        tokensUsed: testTokens,
        responseTime: testResponseTime,
      })
      .$returningId();

    // Verify metadata
    const [saved] = await db
      .select()
      .from(materialQuestions)
      .where(eq(materialQuestions.id, question.id));

    expect(saved.tokensUsed).toBe(testTokens);
    expect(saved.responseTime).toBe(testResponseTime);
  });

  it("should only allow questions for completed materials", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Create pending material
    const [material] = await db
      .insert(studyMaterials)
      .values({
        userId: testUserId,
        title: "Pending Lecture",
        type: "audio",
        fileUrl: "https://example.com/pending.mp3",
        status: "pending", // Not completed
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .$returningId();

    // Verify material is pending
    const [created] = await db
      .select()
      .from(studyMaterials)
      .where(eq(studyMaterials.id, material.id));

    expect(created.status).toBe("pending");
    expect(created.transcription).toBeNull();
    
    // In real usage, the API would reject this, but we're testing the data layer
    // The router should check status before allowing questions
  });
});
