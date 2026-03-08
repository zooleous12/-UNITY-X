import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Mic, 
  FileText, 
  Camera, 
  Brain, 
  Upload,
  Clock,
  TrendingUp,
  Award,
  LogOut,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Video,
  Trash2
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { FounderBadge } from "@/components/FounderBadge";
import { BetaProgressBanner } from "@/components/BetaProgressBanner";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: tierInfo } = trpc.founderTiers.getMyTierInfo.useQuery();
  const { data: stats } = trpc.dashboard.getStats.useQuery();
  const { data: uploadsData } = trpc.uploads.getUploads.useQuery({ limit: 10 });
  const { data: flashcardStats } = trpc.flashcards.getStats.useQuery();
  const { data: reviewStats } = trpc.spacedRepetition.getReviewStats.useQuery({});
  const { data: reviewStreak } = trpc.spacedRepetition.getReviewStreak.useQuery();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<number | null>(null);
  
  const deleteMutation = trpc.uploads.deleteMaterial.useMutation({
    onSuccess: () => {
      // Invalidate queries to refresh the list
      trpc.useUtils().uploads.getUploads.invalidate();
      trpc.useUtils().dashboard.getStats.invalidate();
      setDeleteDialogOpen(false);
      setMaterialToDelete(null);
    },
  });
  
  const handleDeleteClick = (e: React.MouseEvent, materialId: number) => {
    e.preventDefault(); // Prevent navigation to material detail
    e.stopPropagation();
    setMaterialToDelete(materialId);
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (materialToDelete) {
      deleteMutation.mutate({ materialId: materialToDelete });
    }
  };
  
  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button>Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">Lecture Me</span>
                <span className="text-sm ml-2 text-gray-600">College Edition</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/courses">
                <Button variant="ghost" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Courses
                </Button>
              </Link>
              {(user.userTier === "founder_core" || user.userTier === "beta_tester") && (
                <Link href="/founder-settings">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Founder Options
                  </Button>
                </Link>
              )}
              <div className="text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{user.name || "Student"}</span>
                  {tierInfo && (
                    <FounderBadge
                      isFounder={tierInfo.isFounder}
                      isBetaTester={tierInfo.isBetaTester}
                      badge={tierInfo.badge}
                      lifetimeFree={tierInfo.lifetimeFree}
                      betaFreeYearActive={tierInfo.betaFreeYearActive}
                      betaFreeYearDaysRemaining={tierInfo.betaFreeYearDaysRemaining}
                    />
                  )}
                </div>
                <div className="text-muted-foreground text-xs">{user.email}</div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to supercharge your learning with AI?
          </p>
        </div>

        {/* Beta Progress Banner */}
        <div className="mb-6">
          <BetaProgressBanner />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Study Sessions</CardDescription>
              <CardTitle className="text-3xl">{stats?.studySessionsCount || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>This week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Materials Uploaded</CardDescription>
              <CardTitle className="text-3xl">{stats?.materialsCount || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Upload className="w-4 h-4" />
                <span>Total files</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <CardDescription>Flashcards Created</CardDescription>
              <CardTitle className="text-3xl">{flashcardStats?.totalCount || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Brain className="w-4 h-4" />
                  <span>Total cards</span>
                </div>
                {flashcardStats && flashcardStats.dueCount > 0 && (
                  <Badge variant="destructive" className="animate-pulse">
                    {flashcardStats.dueCount} due
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <CardDescription>Cards Due Today</CardDescription>
              <CardTitle className="text-3xl">{reviewStats?.dueToday || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Ready to review</span>
                </div>
                {reviewStats && reviewStats.dueToday > 0 && (
                  <Link href="/review">
                    <Button size="sm" variant="default">
                      Start Review
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Review Streak</CardDescription>
              <CardTitle className="text-3xl">{reviewStreak?.streak || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>Days in a row</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="materials">My Materials</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Record Lecture */}
              <Link href="/record">
                <Card className="card-premium cursor-pointer hover:scale-105 transition-transform border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                      <Mic className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle>Record Lecture</CardTitle>
                    <CardDescription>
                      Record lectures directly in your browser with real-time waveform visualization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm font-medium text-purple-600">
                      <Mic className="w-4 h-4" />
                      Start Recording
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Audio Upload */}
              <Link href="/upload/audio">
                <Card className="card-premium cursor-pointer hover:scale-105 transition-transform">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Mic className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Audio Transcription</CardTitle>
                  <CardDescription>
                    Upload lecture recordings and get AI-powered transcriptions with timestamps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Upload className="w-4 h-4" />
                    Upload Audio
                  </div>
                </CardContent>
              </Card>
              </Link>

              {/* PDF Upload */}
              <Link href="/upload/pdf">
                <Card className="card-premium cursor-pointer hover:scale-105 transition-transform">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle>PDF Analysis</CardTitle>
                  <CardDescription>
                    Upload textbooks and get chapter summaries, definitions, and key concepts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm font-medium text-accent">
                    <Upload className="w-4 h-4" />
                    Upload PDF
                  </div>
                </CardContent>
              </Card>
              </Link>

              {/* Video Upload */}
              <Link href="/upload/video">
                <Card className="card-premium cursor-pointer hover:scale-105 transition-transform">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                    <Video className="w-6 h-6 text-indigo-600" />
                  </div>
                  <CardTitle>Video Upload</CardTitle>
                  <CardDescription>
                    Upload video lectures - we'll extract audio for transcription
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
                    <Upload className="w-4 h-4" />
                    Upload Video
                  </div>
                </CardContent>
              </Card>
              </Link>

              {/* Document Scanner */}
              <Card className="card-premium cursor-pointer hover:scale-105 transition-transform">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Document Scanner</CardTitle>
                  <CardDescription>
                    Scan handwritten notes with voice-guided quality assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    <Camera className="w-4 h-4 mr-2" />
                    Open Scanner
                  </Button>
                  <Badge variant="secondary" className="mt-2">Coming Soon</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle>Your Study Materials</CardTitle>
                <CardDescription>
                  All your uploaded lectures, textbooks, and notes in one place
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uploadsData && uploadsData.uploads.length > 0 ? (
                  <div className="space-y-4">
                    {uploadsData.uploads.map((material) => (
                      <Link key={material.id} href={`/material/${material.id}`}>
                      <Card className="border-l-4 border-l-primary cursor-pointer hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                {material.type === 'audio' ? (
                                  <Mic className="w-5 h-5 text-primary" />
                                ) : (
                                  <FileText className="w-5 h-5 text-primary" />
                                )}
                              </div>
                              <div>
                                <CardTitle className="text-base">{material.title}</CardTitle>
                                <CardDescription className="text-xs">
                                  {material.type === 'audio' ? 'Audio Recording' : 'PDF Document'} • 
                                  {new Date(material.createdAt).toLocaleDateString()}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={material.status === 'completed' ? 'default' : material.status === 'processing' ? 'secondary' : 'outline'}
                              >
                                {material.status}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={(e) => handleDeleteClick(e, material.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {material.status === 'completed' && material.transcription && (
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {material.transcription}
                              </p>
                              <Button size="sm" variant="outline">
                                View Full Details
                              </Button>
                            </div>
                          )}
                          {material.status === 'processing' && (
                            <p className="text-sm text-muted-foreground">
                              AI is processing your {material.type}... This may take a few minutes.
                            </p>
                          )}
                          {material.status === 'failed' && (
                            <p className="text-sm text-destructive">
                              Processing failed: {material.processingError || 'Unknown error'}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <img 
                      src="/robot-studying.jpg" 
                      alt="Robot studying" 
                      className="w-32 h-32 object-contain mb-4 rounded-2xl"
                    />
                    <h3 className="text-lg font-semibold mb-2">No materials yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload your first lecture or textbook to get started
                    </p>
                    <Link href="/upload/audio">
                      <Button>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Material
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flashcards Tab */}
          <TabsContent value="flashcards">
            <Card>
              <CardHeader>
                <CardTitle>Flashcard Review</CardTitle>
                <CardDescription>
                  Review flashcards using spaced repetition for optimal learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                {flashcardStats && flashcardStats.totalCount > 0 ? (
                  <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-3xl font-bold text-primary">{flashcardStats.totalCount}</div>
                        <div className="text-sm text-muted-foreground">Total Cards</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-destructive/10">
                        <div className="text-3xl font-bold text-destructive">{flashcardStats.dueCount}</div>
                        <div className="text-sm text-muted-foreground">Due Now</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-green-500/10">
                        <div className="text-3xl font-bold text-green-600">{flashcardStats.studiedToday}</div>
                        <div className="text-sm text-muted-foreground">Studied Today</div>
                      </div>
                    </div>

                    {/* Quick Study Button */}
                    <div className="flex flex-col items-center gap-4 py-8">
                      {flashcardStats.dueCount > 0 ? (
                        <>
                          <h3 className="text-xl font-semibold">Ready to study?</h3>
                          <p className="text-muted-foreground text-center">
                            You have {flashcardStats.dueCount} flashcard{flashcardStats.dueCount !== 1 ? 's' : ''} waiting for review.
                            <br />
                            Let's keep your knowledge fresh!
                          </p>
                          <Link href="/flashcards/review">
                            <Button size="lg" className="text-lg px-8">
                              <Brain className="w-5 h-5 mr-2" />
                              Start Studying
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-16 h-16 text-green-500" />
                          <h3 className="text-xl font-semibold">All caught up!</h3>
                          <p className="text-muted-foreground text-center">
                            No cards are due right now. Great work!
                            <br />
                            Come back later or generate more flashcards.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <img 
                      src="/robot-learning.jpg" 
                      alt="Robot learning" 
                      className="w-32 h-32 object-contain mb-4 rounded-2xl"
                    />
                    <h3 className="text-lg font-semibold mb-2">No flashcards yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload study materials and generate flashcards to start learning
                    </p>
                    <Link href="/upload/audio">
                      <Button>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Material
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            {/* Review Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">New Cards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{reviewStats?.newCards || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Never reviewed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{reviewStats?.learningCards || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">In progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Mastered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{reviewStats?.matureCards || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Well memorized</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Your learning efficiency and retention rates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Retention Rate</p>
                    <p className="text-xs text-muted-foreground">Percentage of correct reviews</p>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {reviewStats?.retentionRate || 0}%
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Average Ease Factor</p>
                    <p className="text-xs text-muted-foreground">How easily you remember cards</p>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {reviewStats?.averageEaseFactor || 2.5}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Total Cards</p>
                    <p className="text-xs text-muted-foreground">Your complete collection</p>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {reviewStats?.totalCards || 0}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {reviewStats && reviewStats.dueToday > 0 && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Ready to Review
                  </CardTitle>
                  <CardDescription>
                    You have {reviewStats.dueToday} card{reviewStats.dueToday !== 1 ? 's' : ''} waiting for review
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/review">
                    <Button size="lg" className="w-full">
                      <Brain className="w-4 h-4 mr-2" />
                      Start Review Session
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Material?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this material and all associated flashcards and Q&A. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
