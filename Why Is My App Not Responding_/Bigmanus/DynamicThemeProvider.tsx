/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * Lecture Me - College Edition - Dynamic Theme Provider
 * 
 * Applies founder customizations dynamically based on user preferences
 */

import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { data: preferences } = trpc.preferences.getPreferences.useQuery(undefined, {
    enabled: !!user && (user.userTier === "founder_core" || user.userTier === "beta_tester"),
  });

  useEffect(() => {
    if (!preferences) return;

    const root = document.documentElement;

    // Apply purple shade customization
    if (preferences.purpleShade) {
      switch (preferences.purpleShade) {
        case "lighter":
          root.style.setProperty("--primary", "270 70% 65%"); // Lighter purple
          root.style.setProperty("--primary-foreground", "0 0% 100%");
          break;
        case "darker":
          root.style.setProperty("--primary", "270 70% 45%"); // Darker purple
          root.style.setProperty("--primary-foreground", "0 0% 100%");
          break;
        case "default":
        default:
          root.style.setProperty("--primary", "270 70% 55%"); // Default purple
          root.style.setProperty("--primary-foreground", "0 0% 100%");
          break;
      }
    }

    // Apply accent color customization
    if (preferences.accentColor) {
      switch (preferences.accentColor) {
        case "gold":
          root.style.setProperty("--accent", "45 100% 60%"); // Gold
          root.style.setProperty("--accent-foreground", "0 0% 0%");
          break;
        case "blue":
          root.style.setProperty("--accent", "210 100% 60%"); // Blue
          root.style.setProperty("--accent-foreground", "0 0% 100%");
          break;
        case "green":
          root.style.setProperty("--accent", "150 60% 50%"); // Green
          root.style.setProperty("--accent-foreground", "0 0% 100%");
          break;
        case "purple":
        default:
          root.style.setProperty("--accent", "270 70% 60%"); // Purple accent
          root.style.setProperty("--accent-foreground", "0 0% 100%");
          break;
      }
    }

    // Apply font size customization
    if (preferences.fontSize) {
      switch (preferences.fontSize) {
        case "small":
          root.style.fontSize = "14px";
          break;
        case "large":
          root.style.fontSize = "18px";
          break;
        case "medium":
        default:
          root.style.fontSize = "16px";
          break;
      }
    }

    // Apply sidebar position customization
    if (preferences.sidebarPosition) {
      root.setAttribute("data-sidebar-position", preferences.sidebarPosition);
    }

    // Apply card layout customization
    if (preferences.cardLayout) {
      root.setAttribute("data-card-layout", preferences.cardLayout);
    }
  }, [preferences]);

  return <>{children}</>;
}
