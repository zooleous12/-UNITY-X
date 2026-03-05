/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * 
 * Lecture Me - College Edition - Record Lecture Page
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { AudioRecorder } from "@/components/AudioRecorder";
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
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function RecordLecture() {
  const [, setLocation] = useLocation();
  const [lectureName, setLectureName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [notes, setNotes] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // TODO: Fetch user's courses
  const mockCourses = [
    { id: "1", name: "Introduction to Psychology" },
    { id: "2", name: "Calculus I" },
    { id: "3", name: "World History" },
    { id: "4", name: "Computer Science 101" },
  ];

  const handleRecordingComplete = (blob: Blob, recordDuration: number) => {
    setAudioBlob(blob);
    setDuration(recordDuration);
  };

  const handleUpload = async () => {
    if (!audioBlob) {
      toast.error("No recording to upload");
      return;
    }

    if (!lectureName.trim()) {
      toast.error("Please enter a lecture name");
      return;
    }

    if (!courseId) {
      toast.error("Please select a course");
      return;
    }

    setIsUploading(true);

    try {
      // Convert blob to File
      const file = new File([audioBlob], `${lectureName}.webm`, {
        type: "audio/webm",
      });

      // TODO: Implement actual upload via tRPC
      // For now, simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success("Lecture recording uploaded successfully!");
      setLocation("/dashboard");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload recording");
    } finally {
      setIsUploading(false);
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
            <h1 className="text-xl font-bold">Record Lecture</h1>
            <div className="w-32" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Lecture Details */}
          <Card>
            <CardHeader>
              <CardTitle>Lecture Details</CardTitle>
              <CardDescription>
                Provide information about the lecture you're recording
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lectureName">Lecture Name *</Label>
                <Input
                  id="lectureName"
                  placeholder="e.g., Chapter 5: Cognitive Psychology"
                  value={lectureName}
                  onChange={(e) => setLectureName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this lecture..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Audio Recorder */}
          <AudioRecorder onRecordingComplete={handleRecordingComplete} />

          {/* Upload Button */}
          {audioBlob && (
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-green-900">
                      Recording ready to upload
                    </p>
                    <p className="text-sm text-green-700">
                      Duration: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')} • 
                      Size: {(audioBlob.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Lecture
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card className="border-purple-200 bg-purple-50/50">
            <CardHeader>
              <CardTitle className="text-lg">Recording Tips 💡</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Place your device close to the speaker for better audio quality</p>
              <p>• Use headphones to prevent audio feedback</p>
              <p>• Pause recording during breaks to save storage</p>
              <p>• Test your microphone before important lectures</p>
              <p>• Recordings are processed with AI to generate study materials</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
