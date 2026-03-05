import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Loader2, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

interface MaterialQAProps {
  materialId: number;
  materialTitle: string;
}

export function MaterialQA({ materialId, materialTitle }: MaterialQAProps) {
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: questions, refetch } = trpc.qa.getQuestions.useQuery(
    { materialId, limit: 50 },
    { refetchOnWindowFocus: false }
  );

  const askMutation = trpc.qa.askQuestion.useMutation({
    onSuccess: () => {
      setQuestion("");
      setIsAsking(false);
      refetch();
      scrollToBottom();
    },
    onError: (error) => {
      toast.error(`Failed to get answer: ${error.message}`);
      setIsAsking(false);
    },
  });

  const deleteMutation = trpc.qa.deleteQuestion.useMutation({
    onSuccess: () => {
      toast.success("Question deleted");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [questions]);

  const handleAsk = () => {
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (question.length > 1000) {
      toast.error("Question is too long (max 1000 characters)");
      return;
    }

    setIsAsking(true);
    askMutation.mutate({
      materialId,
      question: question.trim(),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const exportQAMutation = trpc.pdfExport.exportQA.useMutation({
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
      toast.success("Q&A session exported as PDF!");
      setExportingPDF(false);
    },
    onError: (error) => {
      toast.error(`Failed to export PDF: ${error.message}`);
      setExportingPDF(false);
    },
  });

  const handleExportQAPDF = () => {
    if (!questions || questions.length === 0) {
      toast.error("No questions to export");
      return;
    }
    setExportingPDF(true);
    exportQAMutation.mutate({ materialId });
  };

  const handleDelete = (questionId: number) => {
    if (confirm("Delete this question and answer?")) {
      deleteMutation.mutate({ questionId });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Ask Questions About This Material
            </CardTitle>
            <CardDescription>
              Get instant AI-powered answers based on the content of "{materialTitle}"
            </CardDescription>
          </div>
          {questions && questions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportQAPDF}
              disabled={exportingPDF}
            >
              {exportingPDF ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export PDF
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Question History */}
        <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
          {questions && questions.length > 0 ? (
            questions.map((q) => (
              <div key={q.id} className="space-y-2">
                {/* User Question */}
                <div className="flex items-start gap-2 justify-end">
                  <div className="bg-primary/10 rounded-lg px-4 py-2 max-w-[80%]">
                    <p className="text-sm font-medium text-primary">You asked:</p>
                    <p className="text-sm">{q.question}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(q.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* AI Answer */}
                <div className="flex items-start gap-2">
                  <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%] relative group">
                    <p className="text-sm font-medium text-primary mb-1">AI Answer:</p>
                    <p className="text-sm whitespace-pre-wrap">{q.answer}</p>
                    {q.responseTime && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Answered in {(q.responseTime / 1000).toFixed(1)}s
                      </p>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(q.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No questions yet. Ask anything about this material!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Question Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question about this material..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isAsking}
            maxLength={1000}
          />
          <Button
            onClick={handleAsk}
            disabled={isAsking || !question.trim()}
            size="icon"
          >
            {isAsking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send • {question.length}/1000 characters
        </p>
      </CardContent>
    </Card>
  );
}
