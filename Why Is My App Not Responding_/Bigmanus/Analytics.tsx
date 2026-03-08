/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * 
 * Lecture Me - College Edition - Analytics Dashboard
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Clock, 
  Target,
  Flame,
  BookOpen,
  CheckCircle2
} from "lucide-react";

export default function Analytics() {
  const { data: overallStats } = trpc.analytics.getOverallStats.useQuery();
  const { data: weeklyStats } = trpc.analytics.getWeeklyStats.useQuery();
  const { data: achievements } = trpc.analytics.getAchievements.useQuery();
  const { data: streak } = trpc.analytics.getStreak.useQuery();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">📊 Analytics Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Track your learning progress and achievements
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Study Time</CardDescription>
            <CardTitle className="text-3xl">
              {overallStats?.totalHours || 0}h
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{overallStats?.totalMinutes || 0} minutes</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Study Sessions</CardDescription>
            <CardTitle className="text-3xl">
              {overallStats?.totalSessions || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span>Total completed</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Overall Accuracy</CardDescription>
            <CardTitle className="text-3xl">
              {overallStats?.accuracy || 0}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="w-4 h-4" />
              <span>{overallStats?.totalCorrect || 0} correct</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Current Streak</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Flame className="w-8 h-8 text-orange-500" />
              {streak?.currentStreak || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Longest: {streak?.longestStreak || 0} days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Weekly Activity
          </CardTitle>
          <CardDescription>Study time over the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyStats?.map((day) => {
              const maxMinutes = Math.max(...(weeklyStats?.map(d => d.minutes) || [1]));
              const percentage = maxMinutes > 0 ? (day.minutes / maxMinutes) * 100 : 0;
              
              return (
                <div key={day.date} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-muted-foreground">
                      {day.minutes} min ({day.sessions} sessions)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements
          </CardTitle>
          <CardDescription>
            {overallStats?.achievementsUnlocked || 0} of {overallStats?.totalAchievements || 8} unlocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements?.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  achievement.unlocked
                    ? 'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200'
                    : 'bg-muted/50 border-muted'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {achievement.name}
                        {achievement.unlocked && (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                  <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                    {achievement.progress}%
                  </Badge>
                </div>
                <Progress value={achievement.progress} className="h-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
