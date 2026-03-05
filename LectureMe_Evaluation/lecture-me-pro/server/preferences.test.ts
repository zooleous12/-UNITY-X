/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * Lecture Me - College Edition - Preferences Router Tests
 */

import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";

// Mock authenticated user context
const mockFounderContext: Context = {
  user: {
    id: 1,
    openId: "test-founder",
    name: "Test Founder",
    email: "founder@test.com",
    role: "user",
    userTier: "founder_core",
    seatNumber: 1,
    lifetimeFree: true,
    founderBadge: "Founder #1",
    betaFreeYearStartDate: null,
    betaFreeYearActive: false,
    betaFreeYearDaysRemaining: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  req: {} as any,
  res: {} as any,
};

describe("Preferences Router", () => {
  const caller = appRouter.createCaller(mockFounderContext);

  it("should create default preferences on first access", async () => {
    const prefs = await caller.preferences.getPreferences();
    
    expect(prefs).toBeDefined();
    expect(prefs.userId).toBe(1);
    expect(prefs.experimentalFeatures).toEqual({ aiRecommendations: true });
    expect(Array.isArray(prefs.submittedSuggestions)).toBe(true);
  });

  it("should update theme preferences", async () => {
    const result = await caller.preferences.updateTheme({
      purpleShade: "darker",
      fontSize: "large",
    });
    
    expect(result.success).toBe(true);
    
    const prefs = await caller.preferences.getPreferences();
    expect(prefs.purpleShade).toBe("darker");
    expect(prefs.fontSize).toBe("large");
  });

  it("should update layout preferences", async () => {
    const result = await caller.preferences.updateLayout({
      sidebarPosition: "right",
      cardLayout: "compact",
    });
    
    expect(result.success).toBe(true);
    
    const prefs = await caller.preferences.getPreferences();
    expect(prefs.sidebarPosition).toBe("right");
    expect(prefs.cardLayout).toBe("compact");
  });

  it("should toggle experimental features", async () => {
    const result = await caller.preferences.toggleFeature({
      featureKey: "aiRecommendations",
      enabled: true,
    });
    
    expect(result.success).toBe(true);
    
    const prefs = await caller.preferences.getPreferences();
    expect(prefs.experimentalFeatures.aiRecommendations).toBe(true);
  });

  it("should submit suggestions", async () => {
    const result = await caller.preferences.submitSuggestion({
      title: "Add dark mode",
      description: "Please add a dark mode toggle to the dashboard",
    });
    
    expect(result.success).toBe(true);
    
    const prefs = await caller.preferences.getPreferences();
    expect(prefs.submittedSuggestions.length).toBeGreaterThan(0);
    expect(prefs.submittedSuggestions[0].title).toBe("Add dark mode");
  });
});
