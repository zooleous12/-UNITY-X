/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * 
 * Lecture Me - College Edition - Beta Progress Banner
 */

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function BetaProgressBanner() {
  const { data: progress } = trpc.founderTiers.getBetaProgress.useQuery();

  if (!progress || progress.isComplete) {
    return null;
  }

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900 dark:text-purple-100">
              Beta Program Progress
            </h3>
          </div>
          <div className="flex items-center gap-1 text-sm text-purple-700 dark:text-purple-300">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">{progress.percentage}%</span>
          </div>
        </div>

        <Progress value={progress.percentage} className="h-2 mb-2" />

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              {progress.current}
            </span>{" "}
            / {progress.target} users
          </span>
          <span className="text-muted-foreground">
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              {progress.remaining}
            </span>{" "}
            users until beta completion
          </span>
        </div>

        <div className="mt-3 p-2 bg-purple-100 dark:bg-purple-900/30 rounded-md">
          <p className="text-xs text-purple-800 dark:text-purple-200">
            🎁 <strong>Beta Testers (users 11-30):</strong> Get 1 FREE YEAR when we reach 1000 users!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
