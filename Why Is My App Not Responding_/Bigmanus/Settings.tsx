/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * 
 * Lecture Me - College Edition - Settings Page
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Save,
  Download,
  Upload,
  RotateCcw,
  Bell,
  Moon,
  Globe,
  Zap,
  Shield,
  Database,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Settings() {
  const [, setLocation] = useLocation();
  
  // Study Preferences
  const [dailyGoal, setDailyGoal] = useState(30);
  const [cardsPerSession, setCardsPerSession] = useState(20);
  const [difficulty, setDifficulty] = useState("intermediate");
  const [studyTime, setStudyTime] = useState("evening");
  
  // App Settings
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [telemetry, setTelemetry] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("daily");

  const handleSavePreferences = () => {
    // TODO: Save to backend
    toast.success("Preferences saved successfully!");
  };

  const handleExportData = () => {
    // TODO: Export user data
    toast.success("Data export started! Check your downloads.");
  };

  const handleImportData = () => {
    // TODO: Import user data
    toast.info("Select a file to import");
  };

  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      setDailyGoal(30);
      setCardsPerSession(20);
      setDifficulty("intermediate");
      setStudyTime("evening");
      setDarkMode(false);
      setNotifications(true);
      setAudioEnabled(true);
      setTelemetry(false);
      setAutoBackup(true);
      setBackupFrequency("daily");
      toast.success("Settings reset to defaults");
    }
  };

  const handleDeleteAccount = () => {
    if (confirm("⚠️ WARNING: This will permanently delete your account and all data. This action cannot be undone!")) {
      if (confirm("Are you ABSOLUTELY sure? Type 'DELETE' to confirm.")) {
        // TODO: Delete account
        toast.error("Account deletion initiated");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setLocation("/dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold">Settings</h1>
            <div className="w-32" /> {/* Spacer */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="study" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="study">Study</TabsTrigger>
            <TabsTrigger value="app">App</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Study Preferences Tab */}
          <TabsContent value="study" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Preferences</CardTitle>
                <CardDescription>
                  Customize your learning experience and study goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Daily Goal */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="daily-goal">Daily Study Goal</Label>
                    <span className="text-sm font-semibold text-primary">
                      {dailyGoal} minutes
                    </span>
                  </div>
                  <Slider
                    id="daily-goal"
                    min={10}
                    max={240}
                    step={5}
                    value={[dailyGoal]}
                    onValueChange={(value) => setDailyGoal(value[0])}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Set your daily study time goal (10-240 minutes)
                  </p>
                </div>

                <Separator />

                {/* Cards Per Session */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cards-session">Cards Per Session</Label>
                    <span className="text-sm font-semibold text-primary">
                      {cardsPerSession} cards
                    </span>
                  </div>
                  <Slider
                    id="cards-session"
                    min={5}
                    max={100}
                    step={5}
                    value={[cardsPerSession]}
                    onValueChange={(value) => setCardsPerSession(value[0])}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    How many flashcards to review in each study session
                  </p>
                </div>

                <Separator />

                {/* Difficulty Level */}
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger id="difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Adjust the complexity of generated study materials
                  </p>
                </div>

                <Separator />

                {/* Preferred Study Time */}
                <div className="space-y-2">
                  <Label htmlFor="study-time">Preferred Study Time</Label>
                  <Select value={studyTime} onValueChange={setStudyTime}>
                    <SelectTrigger id="study-time">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (6am - 12pm)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12pm - 6pm)</SelectItem>
                      <SelectItem value="evening">Evening (6pm - 12am)</SelectItem>
                      <SelectItem value="anytime">Anytime</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    When do you prefer to study? We'll optimize reminders accordingly
                  </p>
                </div>

                <div className="pt-4">
                  <Button onClick={handleSavePreferences} className="w-full" size="lg">
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* App Settings Tab */}
          <TabsContent value="app" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>
                  Configure app behavior and appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode" className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Dark Mode
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Use dark theme for better night studying
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>

                <Separator />

                {/* Notifications */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications" className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Receive study reminders and achievement alerts
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                <Separator />

                {/* Audio */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="audio" className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Audio Feedback
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Play sounds for correct/incorrect answers
                    </p>
                  </div>
                  <Switch
                    id="audio"
                    checked={audioEnabled}
                    onCheckedChange={setAudioEnabled}
                  />
                </div>

                <Separator />

                {/* Auto Backup */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-backup" className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      Automatic Backups
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically backup your data to cloud storage
                    </p>
                  </div>
                  <Switch
                    id="auto-backup"
                    checked={autoBackup}
                    onCheckedChange={setAutoBackup}
                  />
                </div>

                {autoBackup && (
                  <div className="space-y-2 pl-6">
                    <Label htmlFor="backup-freq">Backup Frequency</Label>
                    <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                      <SelectTrigger id="backup-freq">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Separator />

                {/* Telemetry */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="telemetry" className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Usage Analytics
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Help improve Lecture Me by sharing anonymous usage data
                    </p>
                  </div>
                  <Switch
                    id="telemetry"
                    checked={telemetry}
                    onCheckedChange={setTelemetry}
                  />
                </div>

                <div className="pt-4">
                  <Button onClick={handleSavePreferences} className="w-full" size="lg">
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Export, import, and manage your study data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    className="h-24 flex-col gap-2"
                  >
                    <Download className="w-6 h-6" />
                    <div>
                      <div className="font-semibold">Export Data</div>
                      <div className="text-xs text-muted-foreground">
                        Download all your study data
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleImportData}
                    className="h-24 flex-col gap-2"
                  >
                    <Upload className="w-6 h-6" />
                    <div>
                      <div className="font-semibold">Import Data</div>
                      <div className="text-xs text-muted-foreground">
                        Restore from backup
                      </div>
                    </div>
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold">Data Storage</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Study Sessions</p>
                      <p className="font-semibold">0</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Flashcards</p>
                      <p className="font-semibold">0</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Courses</p>
                      <p className="font-semibold">0</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Materials</p>
                      <p className="font-semibold">0</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold text-amber-600">Danger Zone</h4>
                  <Button
                    variant="outline"
                    onClick={handleResetSettings}
                    className="w-full border-amber-200 hover:bg-amber-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset All Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account and subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Account Status</Label>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-semibold text-green-900">✓ Active</p>
                    <p className="text-sm text-green-700">
                      Your account is in good standing
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Subscription</Label>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="font-semibold">Free Tier</p>
                    <p className="text-sm text-muted-foreground">
                      Upgrade to unlock premium features
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => setLocation("/pricing")}
                    >
                      View Plans
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold text-red-600">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
