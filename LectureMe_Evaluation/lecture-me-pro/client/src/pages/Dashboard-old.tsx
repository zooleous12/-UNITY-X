import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  Sparkles
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { FounderBadge } from "@/components/FounderBadge";
import { BetaProgressBanner } from "@/components/BetaProgressBanner";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: tierInfo } = trpc.founderTiers.getMyTierInfo.useQuery();
  
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
              <CardTitle className="text-3xl">0</CardTitle>
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
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Upload className="w-4 h-4" />
                <span>Total files</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Flashcards Created</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Brain className="w-4 h-4" />
                <span>Ready to review</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Study Streak</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                      <Mic className="w-4 h-4 mr-2" />
                      Start Recording
                    </Button>
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
                  <Button className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Audio
                  </Button>
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
                  <Button className="w-full" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload PDF
                  </Button>
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
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No materials yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload your first lecture or textbook to get started
                  </p>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Material
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flashcards Tab */}
          <TabsContent value="flashcards">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Flashcards</CardTitle>
                <CardDescription>
                  Review flashcards created from your study materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Brain className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No flashcards yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload study materials to automatically generate flashcards
                  </p>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Material
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Your Learning Progress</CardTitle>
                <CardDescription>
                  Track your study sessions, achievements, and improvement over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Award className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Start your learning journey</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete your first study session to see your progress
                  </p>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
