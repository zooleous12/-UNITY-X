/**
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
    return null;
  }

  const getBadgeColor = () => {
    if (isFounder) {
      return "bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700";
    }
    if (isBetaTester) {
      return "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700";
    }
    return "";
  };

  const getIcon = () => {
    if (isFounder) {
      return <Crown className="w-3 h-3 mr-1" />;
    }
    if (isBetaTester) {
      return <Sparkles className="w-3 h-3 mr-1" />;
    }
    return null;
  };

  const getTooltipContent = () => {
    if (isFounder && lifetimeFree) {
      return (
        <div className="space-y-1">
          <div className="font-semibold">🏆 Core User</div>
          <div className="text-xs">FREE FOR LIFE</div>
          <div className="text-xs text-muted-foreground">
            All features unlocked • Unlimited access
          </div>
        </div>
      );
    }

    if (isBetaTester) {
      if (betaFreeYearActive && betaFreeYearDaysRemaining) {
        return (
          <div className="space-y-1">
            <div className="font-semibold">🧪 Beta Tester</div>
            <div className="text-xs">1 YEAR FREE ACTIVE</div>
            <div className="text-xs text-muted-foreground">
              {betaFreeYearDaysRemaining} days remaining
            </div>
          </div>
        );
      } else {
        return (
          <div className="space-y-1">
            <div className="font-semibold">🧪 Beta Tester</div>
            <div className="text-xs">1 year free unlocks at 1000 users</div>
          </div>
        );
      }
    }

    return null;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge className={`${getBadgeColor()} ${className} cursor-help`}>
          {getIcon()}
          {badge}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        {getTooltipContent()}
      </TooltipContent>
    </Tooltip>
  );
}
