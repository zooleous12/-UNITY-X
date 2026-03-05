import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PDFUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  const utils = trpc.useUtils();
  const { data: coursesData } = trpc.courses.list.useQuery();
  const createMaterial = trpc.studyMaterials.create.useMutation({
    onSuccess: () => {
      utils.studyMaterials.list.invalidate();
      toast.success("PDF uploaded successfully!");
      // Reset form
      setFile(null);
      setTitle("");
      setProgress(0);
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".pdf")) {
        toast.error("Please upload a PDF file");
        return;
      }

      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (selectedFile.size > maxSize) {
        toast.error("File size must be less than 50MB");
        return;
      }

      setFile(selectedFile);
      // Auto-generate title from filename
      if (!title) {
        const fileName = selectedFile.name.replace(/\.pdf$/i, ""); // Remove extension
        setTitle(fileName);
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast.error("Please select a file and enter a title");
      return;
    }

    setUploading(true);
    setProgress(10);

    try {
      // TODO: Upload to S3 storage
      // For now, we'll simulate the upload
      setProgress(50);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock file URL (replace with actual S3 upload)
      const mockFileUrl = `https://storage.example.com/pdf/${Date.now()}-${file.name}`;
      const mockFileKey = `pdf/${Date.now()}-${file.name}`;
      
      setProgress(70);
      setAnalyzing(true);

      // Create study material record
      await createMaterial.mutateAsync({
        title: title.trim(),
        type: "pdf",
        fileUrl: mockFileUrl,
        fileKey: mockFileKey,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        processingStatus: "processing",
      });

      setProgress(100);
      setAnalyzing(false);
      setUploading(false);

      // TODO: Trigger background analysis job
      toast.success("PDF uploaded! Analysis will begin shortly.");

    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload PDF file");
      setUploading(false);
      setAnalyzing(false);
      setProgress(0);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-accent" />
          </div>
          <div>
            <CardTitle>PDF Analysis</CardTitle>
            <CardDescription>
              Upload textbooks and get chapter summaries, definitions, and key concepts
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* File Input */}
        <div className="space-y-2">
          <Label htmlFor="pdf-file">PDF File</Label>
          <div className="flex items-center gap-4">
            <Input
              id="pdf-file"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              disabled={uploading}
              className="cursor-pointer"
            />
          </div>
          {file && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          )}
        </div>

        {/* Title Input */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="e.g., Biology Textbook Chapter 3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={uploading}
          />
        </div>

        {/* Course Selector */}
        <div className="space-y-2">
          <Label htmlFor="course">Course (Optional)</Label>
          <Select value={courseId} onValueChange={setCourseId} disabled={uploading}>
            <SelectTrigger id="course">
              <SelectValue placeholder="Select a course or leave unassigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No course (unassigned)</SelectItem>
              {coursesData?.courses.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.code ? `${course.code} - ${course.name}` : course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {analyzing ? "Analyzing PDF..." : "Uploading..."}
              </span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {/* Info Alert */}
        {!uploading && (
          <Alert>
            <AlertDescription className="text-sm">
              <strong>Supported format:</strong> PDF (max 50MB)
              <br />
              <strong>Processing time:</strong> Typically 2-5 minutes depending on document length
              <br />
              <strong>AI will extract:</strong> Chapter summaries, key concepts, definitions, and important facts
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!file || !title.trim() || uploading}
          className="w-full"
          size="lg"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {analyzing ? "Analyzing..." : "Uploading..."}
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload & Analyze
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
