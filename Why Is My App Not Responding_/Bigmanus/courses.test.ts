 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * Lecture Me - College Edition - Courses Tests
 */

import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "./db";
import * as schema from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

describe("Courses Router", () => {
  let testUserId: number;
  let testCourseId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    // Create a test user
    const [user] = await db
      .insert(schema.users)
      .values({
        openId: `test-courses-${Date.now()}`,
        name: "Courses Test User",
        email: "courses@test.com",
        role: "user",
      })
      .$returningId();

    testUserId = user.id;