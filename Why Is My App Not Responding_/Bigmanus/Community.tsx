/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * Lecture Me - College Edition - Community Page
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Calendar, BookOpen, Construction, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Community() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-900 py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Construction className="w-20 h-20 text-yellow-400 animate-pulse" />
              <Sparkles className="w-8 h-8 text-purple-300 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Community & Connections
          </h1>
          <p className="text-xl text-purple-200">
            Coming Soon - Building Something Special
          </p>
        </div>

        {/* Under Construction Card */}
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Construction className="w-6 h-6 text-yellow-400" />
              Under Construction
            </CardTitle>
            <CardDescription className="text-purple-200">
              We're building an amazing community space for students to connect, collaborate, and learn together.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>
              The Community page is currently in development. We're working hard to create a space where you can:
            </p>
          </CardContent>
        </Card>

        {/* Planned Features */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-400" />
                <CardTitle className="text-white">Study Groups</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>Find and join study groups with students in your courses. Collaborate on difficult topics and share resources.</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-pink-400" />
                <CardTitle className="text-white">Discussion Forums</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>Ask questions, share study tips, and help fellow students. Build a supportive learning community.</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-400" />
                <CardTitle className="text-white">Study Sessions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>Schedule and join virtual study sessions. Work together in real-time with video chat and screen sharing.</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-green-400" />
                <CardTitle className="text-white">Resource Sharing</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>Share and discover study materials, notes, and resources created by other students in your courses.</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/50 backdrop-blur-sm">
          <CardContent className="p-8 text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">
              Want to be notified when Community launches?
            </h3>
            <p className="text-purple-200">
              We'll let you know as soon as the Community page is ready. In the meantime, keep studying smart!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/20">
                  Learn More About Lecture Me
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-8 text-sm text-gray-400">
          <p>Have ideas for the Community page? We'd love to hear from you!</p>
          <p className="mt-2">Contact: <span className="text-purple-300">lectureme.app@gmail.com</span></p>
        </div>
      </div>
    </div>
  );
}
