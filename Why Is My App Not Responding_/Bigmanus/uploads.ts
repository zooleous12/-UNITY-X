 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * Lecture Me - College Edition - Uploads Router
 */

import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { storagePut } from "../storage";
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";
import { processMaterial } from "../services/materialProcessor";

export const uploadsRouter = router({
  /**
   * Upload audio file
   */
  uploadAudio: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileData: z.string(), // Base64
        courseId: z.number().optional(),
        title: z.string().optional(),
        contentType: z.string().default("audio/webm"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const buffer = Buffer.from(input.fileData, "base64");
      const timestamp = Date.now();
      const sanitized = input.fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileKey = `audio/${userId}/${timestamp}-${sanitized}`;
      
      const { key, url } = await storagePut(fileKey, buffer, input.contentType);
      
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      
      const [material] = await db
        .insert(schema.studyMaterials)
        .values({
          userId,
          courseId: input.courseId,
          title: input.title || input.fileName,
          type: "audio",
          originalFileUrl: url,
          originalFileKey: key,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .$returningId();
      
      // Trigger background processing (async, don't wait)
      processMaterial(material.id).catch((error) => {
        console.error(`Failed to process material ${material.id}:`, error);
      });
      
      return {
        success: true,
        materialId: material.id,
        url,
        message: "Audio uploaded. Transcription starting...",
      };
    }),

  /**
   * Upload PDF file
   */
  uploadPDF: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileData: z.string(),
        courseId: z.number().optional(),
        title: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const buffer = Buffer.from(input.fileData, "base64");
      const timestamp = Date.now();
      const sanitized = input.fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileKey = `pdf/${userId}/${timestamp}-${sanitized}`;
      
      const { key, url } = await storagePut(fileKey, buffer, "application/pdf");
      
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      
      const [material] = await db
        .insert(schema.studyMaterials)
        .values({
          userId,
          courseId: input.courseId,
          title: input.title || input.fileName,
          type: "pdf",
          originalFileUrl: url,
          originalFileKey: key,