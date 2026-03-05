import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  Brain,
  Sparkles,
  Trophy
} from "lucide-react";
import { toast } from "sonner";

export default function ReviewSession() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<number[]>([]);

  const { data: dueCards, isLoading, refetch } = trpc.spacedRepetition.getDueCards.useQuery(
    { limit: 20 },
    { refetchOnWindowFocus: false }
  );

  const reviewMutation = trpc.spacedRepetition.reviewCard.useMutation({
    onSuccess: (result) => {
      toast.success(`Next review in ${formatInterval(result.interval)}`);
      setReviewedCards((prev) => [...prev, currentCard!.id]);
      
      // Move to next card
      if (currentIndex < (dueCards?.length || 0) - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        setSessionComplete(true);
      }
    },
    onError: (error) => {
      toast.error(`Failed to record review: ${error.message}`);
    },
  });

  useEffect(() => {
    if (!user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (sessionComplete) return;

      if (e.key === " " && !showAnswer) {
        e.preventDefault();
        setShowAnswer(true);
      } else if (showAnswer) {
        if (e.key === "1") handleReview("AGAIN");
        else if (e.key === "2") handleReview("HARD");
        else if (e.key === "3") handleReview("GOOD");
        else if (e.key === "4") handleReview("EASY");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showAnswer, sessionComplete]);

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading your review session...</p>
        </div>
      </div>
    );
  }

  if (!dueCards || dueCards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="container max-w-2xl mx-auto py-12">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">All Caught Up! 🎉</h2>
              <p className="text-muted-foreground mb-6">
                You have no cards due for review right now.
                <br />
                Come back later to continue your learning journey!
              </p>
              <Link href="/dashboard">
                <Button>Back to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentCard = dueCards[currentIndex];
  const progress = ((currentIndex + (showAnswer ? 0.5 : 0)) / dueCards.length) * 100;

  const handleReview = (quality: "AGAIN" | "HARD" | "GOOD" | "EASY") => {
    if (!currentCard) return;
    reviewMutation.mutate({
      cardId: currentCard.id,
      quality,
    });
  };

  const formatInterval = (days: number): string => {
    if (days === 0) return "now";
    if (days === 1) return "1 day";
    if (days < 30) return `${days} days`;
    if (days < 365) {
      const months = Math.round(days / 30);
      return months === 1 ? "1 month" : `${months} months`;
    }
    const years = Math.round(days / 365);
    return years === 1 ? "1 year" : `${years} years`;
  };

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="container max-w-2xl mx-auto py-12">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Trophy className="w-20 h-20 text-yellow-500 mb-4" />
              <h2 className="text-3xl font-bold mb-2">Session Complete! 🎉</h2>
              <p className="text-muted-foreground mb-2">
                You reviewed {reviewedCards.length} card{reviewedCards.length !== 1 ? "s" : ""} today
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Keep up the great work! Consistent reviews lead to long-term retention.
              </p>
              <div className="flex gap-3">
                <Link href="/dashboard">
                  <Button>Back to Dashboard</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    refetch();
                    setCurrentIndex(0);
                    setShowAnswer(false);
                    setSessionComplete(false);
                    setReviewedCards([]);
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Review More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="container max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit Review
            </Button>
          </Link>
          <Badge variant="secondary" className="text-sm">
            Card {currentIndex + 1} of {dueCards.length}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center mt-2">
            {Math.round(progress)}% complete
          </p>
        </div>

        {/* Flashcard */}
        <Card className="mb-6 min-h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              {showAnswer ? "Answer" : "Question"}
            </CardTitle>
            <CardDescription>
              {showAnswer ? "How well did you remember?" : "Try to recall the answer"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center px-8">
              {!showAnswer ? (
                <div>
                  <p className="text-2xl font-medium mb-8">{currentCard.front}</p>
                  <Button onClick={() => setShowAnswer(true)} size="lg">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Show Answer
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Or press <kbd className="px-2 py-1 bg-muted rounded">Space</kbd>
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg text-muted-foreground mb-4">{currentCard.front}</p>
                  <div className="h-px bg-border my-4" />
                  <p className="text-2xl font-medium text-primary">{currentCard.back}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rating Buttons */}
        {showAnswer && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-20 flex-col border-red-200 hover:bg-red-50 hover:border-red-300"
              onClick={() => handleReview("AGAIN")}
              disabled={reviewMutation.isPending}
            >
              <span className="text-lg font-semibold mb-1">Again</span>
              <span className="text-xs text-muted-foreground">&lt;1 min</span>
              <kbd className="text-xs mt-1 px-2 py-0.5 bg-muted rounded">1</kbd>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col border-orange-200 hover:bg-orange-50 hover:border-orange-300"
              onClick={() => handleReview("HARD")}
              disabled={reviewMutation.isPending}
            >
              <span className="text-lg font-semibold mb-1">Hard</span>
              <span className="text-xs text-muted-foreground">1 day</span>
              <kbd className="text-xs mt-1 px-2 py-0.5 bg-muted rounded">2</kbd>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col border-green-200 hover:bg-green-50 hover:border-green-300"
              onClick={() => handleReview("GOOD")}
              disabled={reviewMutation.isPending}
            >
              <span className="text-lg font-semibold mb-1">Good</span>
              <span className="text-xs text-muted-foreground">
                {formatInterval(Math.max(currentCard.interval * 2, 6))}
              </span>
              <kbd className="text-xs mt-1 px-2 py-0.5 bg-muted rounded">3</kbd>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              onClick={() => handleReview("EASY")}
              disabled={reviewMutation.isPending}
            >
              <span className="text-lg font-semibold mb-1">Easy</span>
              <span className="text-xs text-muted-foreground">
                {formatInterval(Math.max(currentCard.interval * 3, 14))}
              </span>
              <kbd className="text-xs mt-1 px-2 py-0.5 bg-muted rounded">4</kbd>
            </Button>
          </div>
        )}

        {/* Card Info */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Reviews: {currentCard.correctCount + currentCard.incorrectCount} •
            Accuracy: {
              currentCard.correctCount + currentCard.incorrectCount > 0
                ? Math.round((currentCard.correctCount / (currentCard.correctCount + currentCard.incorrectCount)) * 100)
                : 0
            }% •
            Ease: {currentCard.easeFactor.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
