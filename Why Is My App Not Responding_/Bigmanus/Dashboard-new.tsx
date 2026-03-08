/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * Lecture Me - College Edition - Dashboard
 */

import { useAuth } from "../contexts/AuthContext";
import { trpc } from "../lib/trpc";
import { Link } from "wouter";
import { Mic, FileText, Upload, TrendingUp, Award, Settings, BookOpen } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { FounderBadge } from "../components/FounderBadge";
import { BetaProgressBanner } from "../components/BetaProgressBanner";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: uploads, isLoading: uploadsLoading } = trpc.uploads.getUploads.useQuery({ limit: 5 });
  const { data: tierInfo } = trpc.founderTiers.getTierInfo.useQuery();
  const { data: stats } = trpc.analytics.getStats.useQuery();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Authentication Required</CardTitle>
            <CardDescription>Please log in to access your dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <img src="/logo-icon.png" alt="Lecture Me" className="h-10 w-10" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Lecture Me
                </h1>
                <p className="text-sm text-gray-400">College Edition</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {tierInfo && <FounderBadge tierInfo={tierInfo} />}
              <Link href="/settings">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-400">
            {tierInfo?.isBetaTester 
              ? `Beta Tester #${tierInfo.seatNumber} • ${tierInfo.daysUntilMilestone} days until 1000 users`
              : tierInfo?.isFounder
              ? `Founder #${tierInfo.seatNumber} • Lifetime Access`
              : "Ready to study smarter?"}
          </p>
        </div>

        {/* Beta Progress Banner */}
        {tierInfo?.isBetaTester && <BetaProgressBanner tierInfo={tierInfo} />}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Total Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats?.totalMaterials || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Study Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats?.totalSessions || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats?.currentStreak || 0} days</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats?.achievementsUnlocked || 0}/8</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/record">
            <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer">
              <CardHeader>
                <Mic className="h-8 w-8 text-purple-400 mb-2" />
                <CardTitle className="text-white">Record Lecture</CardTitle>
                <CardDescription>Capture audio directly in your browser</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/upload-audio">
            <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer">
              <CardHeader>
                <Upload className="h-8 w-8 text-blue-400 mb-2" />
                <CardTitle className="text-white">Upload Audio</CardTitle>
                <CardDescription>Import existing lecture recordings</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/upload-pdf">
            <Card className="bg-gradient-to-br from-pink-900/50 to-purple-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer">
              <CardHeader>
                <FileText className="h-8 w-8 text-pink-400 mb-2" />
                <CardTitle className="text-white">Upload PDF</CardTitle>
                <CardDescription>Analyze textbooks and notes</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Recent Uploads */}
        <Card className="bg-slate-900/50 border-purple-500/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recent Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            {uploadsLoading ? (
              <div className="text-gray-400">Loading...</div>
            ) : uploads && uploads.uploads.length > 0 ? (
              <div className="space-y-4">
                {uploads.uploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-purple-500/10"
                  >
                    <div className="flex items-center gap-4">
                      {upload.type === "audio" ? (
                        <Mic className="h-5 w-5 text-purple-400" />
                      ) : (
                        <FileText className="h-5 w-5 text-pink-400" />
                      )}
                      <div>
                        <h4 className="text-white font-medium">{upload.title}</h4>
                        <p className="text-sm text-gray-400">
                          {upload.status === "completed" && upload.transcription
                            ? `${upload.wordCount} words • ${Math.floor((upload.duration || 0) / 60)} min`
                            : upload.status === "processing"
                            ? "Processing..."
                            : upload.status === "failed"
                            ? "Failed"
                            : "Pending"}
                        </p>
                      </div>
                    </div>
                    {upload.status === "completed" && (
                      <Link href={`/material/${upload.id}`}>
                        <Button variant="outline" size="sm" className="border-purple-500/20">
                          View
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No materials yet. Start by uploading or recording a lecture!</p>
                <Link href="/record">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Mic className="h-4 w-4 mr-2" />
                    Record Your First Lecture
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bottom Navigation */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/analytics">
            <Card className="bg-slate-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  View Analytics
                </CardTitle>
                <CardDescription>Track your progress and achievements</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/pricing">
            <Card className="bg-gradient-to-br from-amber-900/50 to-yellow-900/50 border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-400" />
                  Upgrade Plan
                </CardTitle>
                <CardDescription>Unlock unlimited features</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
