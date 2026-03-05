 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * Lecture Me - Material Processing Service
 * 
 * Handles background processing of uploaded materials:
 * - Audio/Video transcription using Whisper
 * - PDF text extraction
 * - Study guide generation using GPT
 */

import { getDb } from "../db";
import * as schema from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";
import { transcribeAudio as whisperTranscribe } from "../_core/voiceTranscription";

/**
 * Process a single material by ID
 */
export async function processMaterial(materialId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Get the material
  const [material] = await db
    .select()
    .from(schema.studyMaterials)
    .where(eq(schema.studyMaterials.id, materialId));

  if (!material) {
    throw new Error(`Material ${materialId} not found`);
  }

  if (material.status !== "pending") {
    console.log(`Material ${materialId} already processed (status: ${material.status})`);
    return;
  }

  try {
    // Update status to processing
    await db
      .update(schema.studyMaterials)
      .set({ status: "processing", updatedAt: new Date() })
      .where(eq(schema.studyMaterials.id, materialId));

    let transcription = "";
    let studyGuide = "";
    let keyPoints: string[] = [];

    // Process based on type