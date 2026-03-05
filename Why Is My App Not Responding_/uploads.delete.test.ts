/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * Lecture Me - College Edition - Delete Material Tests
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import * as schema from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

const testUserId = 999999;
const testUserId2 = 999998;

describe("Delete Material", () => {
  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    // Clean up any existing test data
    await db.delete(schema.flashcards).where(eq(schema.flashcards.userId, testUserId));
    await db.delete(schema.materialQuestions).where(eq(schema.materialQuestions.userId, testUserId));
    await db.delete(schema.studyMaterials).where(eq(schema.studyMaterials.userId, testUserId));
    await db.delete(schema.flashcards).where(eq(schema.flashcards.userId, testUserId2));
    await db.delete(schema.studyMaterials).where(eq(schema.studyMaterials.userId, testUserId2));
  });

  afterAll(async () => {
    const db = await getDb();
    if (db) {
      // Clean up test data
      await db.delete(schema.flashcards).where(eq(schema.flashcards.userId, testUserId));
      await db.delete(schema.materialQuestions).where(eq(schema.materialQuestions.userId, testUserId));
      await db.delete(schema.studyMaterials).where(eq(schema.studyMaterials.userId, testUserId));
      await db.delete(schema.flashcards).where(eq(schema.flashcards.userId, testUserId2));
      await db.delete(schema.studyMaterials).where(eq(schema.studyMaterials.userId, testUserId2));
    }
  });

  it("should delete a material with no associated data", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    // Create a test material
    const [material] = await db
      .insert(schema.studyMaterials)
      .values({
        userId: testUserId,
        title: "Test Material",
        type: "audio",
        originalFileUrl: "https://example.com/test.mp3",
        originalFileKey: "test-key",
        status: "completed",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .$returningId();

    // Delete the material
    await db
      .delete(schema.studyMaterials)
      .where(eq(schema.studyMaterials.id, material.id));

    // Verify deletion
    const [deleted] = await db
      .select()
      .from(schema.studyMaterials)
      .where(eq(schema.studyMaterials.id, material.id));

    expect(deleted).toBeUndefined();
  });

  it("should delete a material and all associated flashcards", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    // Create a test material
    const [material] = await db
      .insert(schema.studyMaterials)
      .values({
        userId: testUserId,
        title: "Test Material with Flashcards",
        type: "audio",
        originalFileUrl: "https://example.com/test.mp3",
        originalFileKey: "test-key",
        status: "completed",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .$returningId();

    // Create flashcards for this material
    await db.insert(schema.flashcards).values([
      {
        userId: testUserId,
        studyMaterialId: material.id,
        front: "Question 1",
        back: "Answer 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: testUserId,
        studyMaterialId: material.id,
        front: "Question 2",
        back: "Answer 2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Delete associated flashcards
    await db
      .delete(schema.flashcards)
      .where(eq(schema.flashcards.studyMaterialId, material.id));

    // Delete the material
    await db
      .delete(schema.studyMaterials)
      .where(eq(schema.studyMaterials.id, material.id));

    // Verify material deletion
    const [deletedMaterial] = await db
      .select()
      .from(schema.studyMaterials)
      .where(eq(schema.studyMaterials.id, material.id));

    expect(deletedMaterial).toBeUndefined();

    // Verify flashcards deletion
    const flashcards = await db
      .select()
      .from(schema.flashcards)
      .where(eq(schema.flashcards.studyMaterialId, material.id));

    expect(flashcards).toHaveLength(0);
  });

  it("should delete a material and all associated Q&A", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    // Create a test material
    const [material] = await db
      .insert(schema.studyMaterials)
      .values({
        userId: testUserId,
        title: "Test Material with Q&A",
        type: "pdf",
        originalFileUrl: "https://example.com/test.pdf",
        originalFileKey: "test-key",
        status: "completed",
        transcription: "Test content for Q&A",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .$returningId();

    // Create Q&A for this material
    await db.insert(schema.materialQuestions).values([
      {
        userId: testUserId,
        materialId: material.id,
        question: "What is this about?",
        answer: "This is a test",
        tokensUsed: 100,
        responseTimeMs: 500,
        createdAt: new Date(),
      },
      {
        userId: testUserId,
        materialId: material.id,
        question: "Another question?",
        answer: "Another answer",
        tokensUsed: 150,
        responseTimeMs: 600,
        createdAt: new Date(),
      },
    ]);

    // Delete associated Q&A
    await db
      .delete(schema.materialQuestions)
      .where(eq(schema.materialQuestions.materialId, material.id));

    // Delete the material
    await db
      .delete(schema.studyMaterials)
      .where(eq(schema.studyMaterials.id, material.id));

    // Verify material deletion
    const [deletedMaterial] = await db
      .select()
      .from(schema.studyMaterials)
      .where(eq(schema.studyMaterials.id, material.id));

    expect(deletedMaterial).toBeUndefined();

    // Verify Q&A deletion
    const questions = await db
      .select()
      .from(schema.materialQuestions)
      .where(eq(schema.materialQuestions.materialId, material.id));

    expect(questions).toHaveLength(0);
  });

  it("should only allow owner to delete their material", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    // User 1 creates a material
    const [material] = await db
      .insert(schema.studyMaterials)
      .values({
        userId: testUserId,
        title: "User 1 Material",
        type: "audio",
        originalFileUrl: "https://example.com/test.mp3",
        originalFileKey: "test-key",
        status: "completed",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .$returningId();

    // Verify User 2 cannot see/delete User 1's material
    const [materialAsUser2] = await db
      .select()
      .from(schema.studyMaterials)
      .where(and(eq(schema.studyMaterials.id, material.id), eq(schema.studyMaterials.userId, testUserId2)));

    expect(materialAsUser2).toBeUndefined();

    // Clean up
    await db
      .delete(schema.studyMaterials)
      .where(eq(schema.studyMaterials.id, material.id));
  });

  it("should handle deleting material with both flashcards and Q&A", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    // Create a test material
    const [material] = await db
      .insert(schema.studyMaterials)
      .values({
        userId: testUserId,
        title: "Complete Test Material",
        type: "audio",
        originalFileUrl: "https://example.com/test.mp3",
        originalFileKey: "test-key",
        status: "completed",
        transcription: "Test content",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .$returningId();

    // Create flashcards
    await db.insert(schema.flashcards).values({
      userId: testUserId,
      studyMaterialId: material.id,
      front: "Question",
      back: "Answer",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create Q&A
    await db.insert(schema.materialQuestions).values({
      userId: testUserId,
      materialId: material.id,
      question: "Test question",
      answer: "Test answer",
      tokensUsed: 100,
      responseTimeMs: 500,
      createdAt: new Date(),
    });

    // Delete all associated data
    await db
      .delete(schema.flashcards)
      .where(eq(schema.flashcards.studyMaterialId, material.id));
    
    await db
      .delete(schema.materialQuestions)
      .where(eq(schema.materialQuestions.materialId, material.id));
    
    await db
      .delete(schema.studyMaterials)
      .where(eq(schema.studyMaterials.id, material.id));

    // Verify everything is deleted
    const [deletedMaterial] = await db
      .select()
      .from(schema.studyMaterials)
      .where(eq(schema.studyMaterials.id, material.id));

    const flashcards = await db
      .select()
      .from(schema.flashcards)
      .where(eq(schema.flashcards.studyMaterialId, material.id));

    const questions = await db
      .select()
      .from(schema.materialQuestions)
      .where(eq(schema.materialQuestions.materialId, material.id));

    expect(deletedMaterial).toBeUndefined();
    expect(flashcards).toHaveLength(0);
    expect(questions).toHaveLength(0);
  });
});
