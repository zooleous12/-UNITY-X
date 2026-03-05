import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { 
  ArrowLeft, 
  Copy, 
  Download, 
  FileText, 
  Mic,
  Sparkles,
  Loader2,
  CheckCircle2,
  Clock,
  Brain
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { MaterialQA } from "@/components/MaterialQA";

export default function MaterialDetail() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams();
  const materialId = parseInt(params.id || "0");
  const [copying, setCopying] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  const generateFlashcardsMutation = trpc.flashcards.generate.useMutation({
    onSuccess: (result) => {
      toast.success(result.message);
      setGenerating(false);
    },
    onError: (error) => {
      toast.error(`Failed to generate flashcards: ${error.message}`);
      setGenerating(false);
    },
  });

  const handleGenerateFlashcards = () => {
    if (!material.transcription && !material.summary) {
      toast.error("No content available to generate flashcards");
      return;
    }
    setGenerating(true);
    generateFlashcardsMutation.mutate({
      materialId: material.id,
      count: 10,
    });
  };

  const { data, isLoading, error, refetch } = trpc.uploads.getMaterial.useQuery(
    { materialId },
    { enabled: !!materialId && !!user }
  );

  // Auto-refresh for pending/processing materials
  useEffect(() => {
    if (data?.material && (data.material.status === 'pending' || data.material.status === 'processing')) {
      const interval = setInterval(() => {
        refetch();
      }, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [data?.material, refetch]);

  if (!user) {
    setLocation("/");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading material...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Material Not Found</CardTitle>
            <CardDescription>
              {error?.message || "This material doesn't exist or you don't have access to it."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { material, course } = data;

  const handleCopyTranscription = async () => {
    if (!material.transcription) {
      toast.error("No transcription available");
      return;
    }

    setCopying(true);
    try {
      await navigator.clipboard.writeText(material.transcription);
      toast.success("Transcription copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    } finally {
      setCopying(false);
    }
  };

  const exportStudyGuideMutation = trpc.pdfExport.exportStudyGuide.useMutation({
    onSuccess: (result) => {
      // Convert base64 to blob and download
      const byteCharacters = atob(result.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Study guide exported as PDF!");
      setExportingPDF(false);
    },
    onError: (error) => {
      toast.error(`Failed to export PDF: ${error.message}`);
      setExportingPDF(false);
    },
  });

  const handleExportStudyGuidePDF = () => {
    setExportingPDF(true);
    exportStudyGuideMutation.mutate({ materialId: material.id });
  };

  const handleDownloadTxt = () => {
    if (!material.transcription) {
      toast.error("No transcription available");
      return;
    }

    const blob = new Blob([material.transcription], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${material.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded as TXT");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>;
      case "processing":
        return <Badge className="bg-blue-500"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Processing</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "audio":
        return <Mic className="w-5 h-5" />;
      case "pdf":
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">Lecture Me</span>
                <span className="text-sm ml-2 text-gray-600">College Edition</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Material Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    {getTypeIcon(material.type)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{material.title}</CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      {getStatusBadge(material.status)}
                      <Badge variant="outline" className="capitalize">{material.type}</Badge>
                      {course && (
                        <Badge 
                          style={{ 
                            backgroundColor: `${course.color}20`,
                            color: course.color,
                            borderColor: course.color
                          }}
                        >
                          {course.code || course.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <CardDescription>
                Uploaded {new Date(material.createdAt).toLocaleDateString()} at{" "}
                {new Date(material.createdAt).toLocaleTimeString()}
              </CardDescription>
            </CardHeader>
            {material.status === 'completed' && (material.transcription || material.summary) && (
              <CardContent>
                <Button 
                  onClick={handleGenerateFlashcards}
                  disabled={generating}
                  className="w-full"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Flashcards...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Generate Flashcards
                    </>
                  )}
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Summary/Study Guide */}
          {material.summary && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI-Generated Study Guide
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportStudyGuidePDF}
                    disabled={exportingPDF}
                  >
                    {exportingPDF ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Export PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{material.summary}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Points */}
          {material.keyPoints && material.keyPoints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Key Points</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {material.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Transcription */}
          {material.transcription && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Full Transcription</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyTranscription}
                      disabled={copying}
                    >
                      {copying ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadTxt}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download TXT
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <p className="whitespace-pre-wrap font-mono text-sm">
                    {material.transcription}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Content Message */}
          {!material.transcription && !material.summary && material.status === "completed" && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Content Available</h3>
                <p className="text-muted-foreground">
                  This material has been processed but no transcription or summary was generated.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Processing Message */}
          {material.status === "processing" && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <h3 className="text-lg font-semibold mb-2">Processing in Progress</h3>
                <p className="text-muted-foreground">
                  Your material is being analyzed. This usually takes 1-2 minutes.
                  <br />
                  This page will auto-refresh every 5 seconds.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Pending Message */}
          {material.status === "pending" && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="w-12 h-12 text-yellow-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Queued for Processing</h3>
                <p className="text-muted-foreground">
                  Your material is in the queue and will be processed shortly.
                  <br />
                  Processing typically begins within 30 seconds.
                  <br />
                  This page will auto-refresh every 5 seconds.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Failed Message */}
          {material.status === "failed" && (
            <Card className="border-destructive">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="w-12 h-12 text-destructive mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-destructive">Processing Failed</h3>
                <p className="text-muted-foreground">
                  We encountered an error while processing your material.
                  <br />
                  Please try uploading again or contact support if the issue persists.
                </p>
                <Link href="/dashboard">
                  <Button className="mt-4">Back to Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Q&A Section - Only show for completed materials */}
          {material.status === "completed" && (material.transcription || material.summary) && (
            <MaterialQA materialId={material.id} materialTitle={material.title} />
          )}
        </div>
      </div>
    </div>
  );
}
