import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "./db";
import * as schema from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Video Upload", () => {
  let testUserId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    // Create a test user
    const [user] = await db
      .insert(schema.users)
      .values({
        openId: `test-video-${Date.now()}`,
        name: "Video Test User",
        email: "video@test.com",
        role: "user",
      })
      .$returningId();

    testUserId = user.id;
  });

  it("should create video material record in database", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    
    const [material] = await db
      .insert(schema.studyMaterials)
      .values({
        userId: testUserId,
        title: "Biology 101 Lecture",
        type: "video",
        originalFileUrl: "https://placeholder.com/video/test.mp4",
        originalFileKey: "video/test.mp4",
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .$returningId();
    
    expect(material.id).toBeTypeOf("number");
    
    // Verify it was created
    const materials = await db
      .select()
      .from(schema.studyMaterials)
      .where(eq(schema.studyMaterials.id, material.id));
    
    expect(materials.length).toBe(1);
    expect(materials[0].type).toBe("video");
    expect(materials[0].status).toBe("pending");
  });

  it("should link video material to course", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    
    // Create a course
    const [course] = await db
      .insert(schema.courses)
      .values({
        userId: testUserId,
        name: "Biology 101",
        code: "BIO101",
        color: "#10b981",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .$returningId();
    
    // Create video material linked to course
    const [material] = await db
      .insert(schema.studyMaterials)
      .values({
        userId: testUserId,
        courseId: course.id,
        title: "Lecture Video",
        type: "video",
        originalFileUrl: "https://placeholder.com/video/lecture.mp4",
        originalFileKey: "video/lecture.mp4",
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .$returningId();
    
    // Verify course link
    const materials = await db
      .select()
      .from(schema.studyMaterials)
      .where(eq(schema.studyMaterials.id, material.id));
    
    expect(materials[0].courseId).toBe(course.id);
  });

  it("should store video type in database", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");
    
    const [material] = await db
      .insert(schema.studyMaterials)
      .values({
        userId: testUserId,
        title: "Video Lecture",
        type: "video",
        originalFileUrl: "https://placeholder.com/video/test.webm",
        originalFileKey: "video/test.webm",
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .$returningId();
    
    const materials = await db
      .select()
      .from(schema.studyMaterials)
      .where(eq(schema.studyMaterials.id, material.id));
    
    expect(materials[0].type).toBe("video");
  });
});
