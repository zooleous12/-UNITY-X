/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * Lecture Me - College Edition - Uploads Tests
 */

import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "./db";
import * as schema from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

describe("Uploads Router", () => {
  let testUserId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    // Create a test user
    const [user] = await db
      .insert(schema.users)
      .values({
        openId: `test-uploads-${Date.now()}`,
        name: "Uploads Test User",
        email: "uploads@test.com",
        role: "user",
      })
      .$returningId();

    testUserId = user.id;
  });

  it("should retrieve user uploads with correct structure", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    // Insert test materials
    await db.insert(schema.studyMaterials).values([
      {
        userId: testUserId,
        title: "Lecture 1 - Introduction",
        type: "audio",
        status: "completed",
        originalFileUrl: "https://example.com/lecture1.mp3",
        originalFileKey: "audio/lecture1.mp3",
        transcription: "This is a test transcription of lecture 1.",
        summary: "Introduction to the course material.",
      },
      {
        userId: testUserId,
        title: "Chapter 3 Notes",
        type: "pdf",
        status: "processing",
        originalFileUrl: "https://example.com/chapter3.pdf",
        originalFileKey: "pdf/chapter3.pdf",
      },
    ]);

    // Query uploads (simulating the getUploads procedure)
    const uploads = await db
      .select()
      .from(schema.studyMaterials)
      .where(eq(schema.studyMaterials.userId, testUserId))
      .orderBy(desc(schema.studyMaterials.createdAt))
      .limit(20);

    expect(uploads.length).toBeGreaterThanOrEqual(2);
    
    // Verify structure matches what Dashboard expects
    const firstUpload = uploads[0];
    expect(firstUpload).toHaveProperty("id");
    expect(firstUpload).toHaveProperty("title");
    expect(firstUpload).toHaveProperty("type");
    expect(firstUpload).toHaveProperty("status");
    expect(firstUpload).toHaveProperty("createdAt");
    expect(firstUpload).toHaveProperty("transcription");
    expect(firstUpload).toHaveProperty("summary");
  });

  it("should filter uploads by user correctly", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    // Create another user
    const [otherUser] = await db
      .insert(schema.users)
      .values({
        openId: `test-other-${Date.now()}`,
        name: "Other User",
        email: "other@test.com",
        role: "user",
      })
      .$returningId();

    // Insert material for other user
    await db.insert(schema.studyMaterials).values({
      userId: otherUser.id,
      title: "Other User's Lecture",
      type: "audio",
      status: "completed",
      originalFileUrl: "https://example.com/other.mp3",
      originalFileKey: "audio/other.mp3",
    });

    // Query only test user's uploads
    const uploads = await db
      .select()
      .from(schema.studyMaterials)
      .where(eq(schema.studyMaterials.userId, testUserId));

    // Verify all uploads belong to test user
    uploads.forEach((upload) => {
      expect(upload.userId).toBe(testUserId);
    });
  });

  it("should handle empty uploads list", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    // Create a new user with no uploads
    const [emptyUser] = await db
      .insert(schema.users)
      .values({
        openId: `test-empty-${Date.now()}`,
        name: "Empty User",
        email: "empty@test.com",
        role: "user",
      })
      .$returningId();

    // Query uploads
    const uploads = await db
      .select()
      .from(schema.studyMaterials)
      .where(eq(schema.studyMaterials.userId, emptyUser.id));

    expect(uploads).toEqual([]);
  });
});
