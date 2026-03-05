/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * 
 * This file is part of Lecture Me - College Edition™, an AI-powered study platform.
 * Unauthorized copying, distribution, or modification is strictly prohibited.
 * 
 * Author: Charles Kendrick <lectureme.app@gmail.com>
 * Project: Lecture Me - College Edition
 * Location: Phoenix, Arizona, USA
 * 
 * For licensing inquiries: lectureme.app@gmail.com
 */
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { studyMaterialsRouter } from "./routers/studyMaterials";
import { stripeRouter } from "./routers/stripe";
import { founderTiersRouter } from "./routers/founderTiers";
import { analyticsRouter } from "./routers/analytics";
import { uploadsRouter } from "./routers/uploads";
import { aiProcessingRouter } from "./routers/aiProcessing";
import { dashboardRouter } from "./routers/dashboard";
import { coursesRouter } from "./routers/courses";
import { flashcardsRouter } from "./routers/flashcards";
import { preferencesRouter } from "./routers/preferences";
import { founderAnalyticsRouter } from "./routers/founderAnalytics";
import { qaRouter } from "./routers/qa";
import { spacedRepetitionRouter } from "./routers/spacedRepetition";
import { pdfExportRouter } from "./routers/pdfExport";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  studyMaterials: studyMaterialsRouter,
  stripe: stripeRouter,
  founderTiers: founderTiersRouter,
  analytics: analyticsRouter,
  uploads: uploadsRouter,
  aiProcessing: aiProcessingRouter,
  dashboard: dashboardRouter,
  courses: coursesRouter,
  flashcards: flashcardsRouter,
  preferences: preferencesRouter,
  founderAnalytics: founderAnalyticsRouter,
  qa: qaRouter,
  spacedRepetition: spacedRepetitionRouter,
  pdfExport: pdfExportRouter,
});

export type AppRouter = typeof appRouter;
