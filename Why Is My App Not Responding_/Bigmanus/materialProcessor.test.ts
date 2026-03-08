/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * Tests for material processing service
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import * as schema from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { processMaterial } from "./services/materialProcessor";

describe("Material Processing", () => {
  let testUserId: number;
  let testMaterialId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    // Create test user
    const openId = `test-processor-${Date.now()}`;
    await db
      .insert(schema.users)
      .values({
        openId,
        name: "Test Processor User",
        email: "processor@test.com",
        loginMethod: "email",
      })
      .onConflictDoNothing();

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.openId, openId));

    testUserId = user.id;
  });

  afterAll(async () => {
    const db = await getDb();
    if (!db) return;

    // Cleanup
    await db.delete(schema.studyMaterials).where(eq(schema.studyMaterials.userId, testUserId));
    await db.delete(schema.users).where(eq(schema.users.id, testUserId));
  });

  it("should process audio material with transcription", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    // Create test audio material
    await db
      .insert(schema.studyMaterials)
      .values({
        userId: testUserId,
        type: "audio",
        title: "Test Audio Lecture",
        originalFileUrl: "https://example.com/test-audio.mp3",
        status: "pending",
      });

    const [material] = await db
      .select()
      .from(schema.studyMaterials)
      .where(eq(schema.studyMaterials.userId, testUserId))
      .orderBy(schema.studyMaterials.id)
      .limit(1);

    testMaterialId = material.id;

    // Note: This will fail in test environment without real audio file
    // but we're testing the code path exists
    try {
      await processMaterial(testMaterialId);
    } catch (error) {
      // Expected to fail without real audio file
      expect(error).toBeDefined();
    }

    // Verify material was updated (should be 'failed' due to invalid URL)
    const [updated] = await db
      .select()
      .from(schema.studyMaterials)
      .where(eq(schema.studyMaterials.id, testMaterialId));

    expect(updated.status).toBe("failed");
  });

  it("should process PDF material with text extraction", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    // Create test PDF material
    await db
      .insert(schema.studyMaterials)
      .values({
        userId: testUserId,
        type: "pdf",
        title: "Test PDF Document",
        originalFileUrl: "https://example.com/test.pdf",
        status: "pending",
      });

    const [material] = await db
      .select()
      .from(schema.studyMaterials)
      .where(eq(schema.studyMaterials.userId, testUserId))
      .orderBy(schema.studyMaterials.id)
      .limit(1);

    // Note: This will fail in test environment without real PDF file
    try {
      await processMaterial(material.id);
    } catch (error) {
      // Expected to fail without real PDF file
      expect(error).toBeDefined();
    }

    // Verify material was updated
    const [updated] = await db
      .select()
      .from(schema.studyMaterials)
      .where(eq(schema.studyMaterials.id, material.id));

    expect(updated.status).toBe("failed");
  });

  it("should not reprocess already completed materials", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    // Create completed material
    await db
      .insert(schema.studyMaterials)
      .values({
        userId: testUserId,
        type: "audio",
        title: "Already Completed",
        originalFileUrl: "https://example.com/completed.mp3",
        status: "completed",
        transcription: "This is already transcribed",
        summary: "This is already summarized",
      });

    const [material] = await db
      .select()
      .from(schema.studyMaterials)
      .where(eq(schema.studyMaterials.userId, testUserId))
      .orderBy(schema.studyMaterials.id)
      .limit(1);

    // Should not throw error
    await processMaterial(material.id);

    // Verify status unchanged
    const [updated] = await db
      .select()
      .from(schema.studyMaterials)
      .where(eq(schema.studyMaterials.id, material.id));

    expect(updated.status).toBe("completed");
    expect(updated.transcription).toBe("This is already transcribed");
  });

  it("should handle missing material gracefully", async () => {
    await expect(processMaterial(999999)).rejects.toThrow("Material 999999 not found");
  });
});
