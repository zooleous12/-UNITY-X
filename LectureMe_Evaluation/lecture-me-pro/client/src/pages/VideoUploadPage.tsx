import { VideoUpload } from "@/components/VideoUpload";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function VideoUploadPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-4xl">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        <VideoUpload />
      </div>
    </div>
  );
}
