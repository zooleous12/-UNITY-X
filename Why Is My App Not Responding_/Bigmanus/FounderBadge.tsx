 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * 
 * Lecture Me - College Edition - Founder Badge Component
 */

import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FounderBadgeProps {
  isFounder: boolean;
  isBetaTester: boolean;
  badge: string | null;
  lifetimeFree?: boolean;
  betaFreeYearActive?: boolean;
  betaFreeYearDaysRemaining?: number;
  className?: string;
}

export function FounderBadge({
  isFounder,
  isBetaTester,
  badge,
  lifetimeFree,
  betaFreeYearActive,
  betaFreeYearDaysRemaining,
  className = "",
}: FounderBadgeProps) {
  if (!isFounder && !isBetaTester) {