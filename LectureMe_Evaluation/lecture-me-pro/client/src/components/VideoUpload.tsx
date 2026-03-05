import { useState } from "react";
import { Upload, Video, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime", // MOV
  "video/x-msvideo", // AVI
  "video/webm",
  "video/x-matroska", // MKV
  "video/x-flv", // FLV
  "video/x-ms-wmv", // WMV
];

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

export function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>("");


  const { data: coursesData } = trpc.courses.list.useQuery();
  const courses = coursesData?.courses || [];
  const uploadMutation = trpc.uploads.uploadVideo.useMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!ACCEPTED_VIDEO_TYPES.includes(selectedFile.type)) {
      setError(
        "Invalid file type. Please upload MP4, MOV, AVI, WEBM, MKV, FLV, or WMV files."
      );
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File too large. Maximum size is 200MB.");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Upload video
      await uploadMutation.mutateAsync({
        filename: file.name,
        fileSize: file.size,
        mimeType: file.type,
        courseId: selectedCourse ? parseInt(selectedCourse) : undefined,
      });

      clearInterval(progressInterval);
      setProgress(100);
      setSuccess(true);
      setFile(null);

      toast.success("Video uploaded successfully!", {
        description: "Audio is being extracted and transcribed. Check your dashboard in a few minutes.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      toast.error("Upload failed", {
        description: "Please try again or contact support.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Upload Video Lecture</h2>
          <p className="text-muted-foreground">
            Upload a video file and we'll extract the audio for transcription.
            Supports MP4, MOV, AVI, WEBM, MKV, FLV, WMV (max 200MB)
          </p>
        </div>

        {/* Course Selection */}
        {courses.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Course (Optional)
            </label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No course</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.code} - {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {!file && !uploading && !success && (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Video className="w-12 h-12 mb-4 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                MP4, MOV, AVI, WEBM, MKV, FLV, WMV (MAX 200MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept={ACCEPTED_VIDEO_TYPES.join(",")}
              onChange={handleFileChange}
            />
          </label>
        )}

        {file && !uploading && !success && (
          <div className="space-y-4">
            <Alert>
              <Video className="h-4 w-4" />
              <AlertDescription>
                <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button onClick={handleUpload} className="flex-1">
                <Upload className="mr-2 h-4 w-4" />
                Upload Video
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setError(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {uploading && (
          <div className="space-y-4">
            <Alert>
              <Video className="h-4 w-4 animate-pulse" />
              <AlertDescription>
                Uploading and extracting audio... This may take a few minutes for large files.
              </AlertDescription>
            </Alert>
            <Progress value={progress} />
            <p className="text-sm text-center text-muted-foreground">{progress}%</p>
          </div>
        )}

        {success && (
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription>
              Video uploaded successfully! Audio extraction and transcription in progress.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
}
