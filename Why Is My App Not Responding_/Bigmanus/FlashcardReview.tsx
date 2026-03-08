import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { 
  ArrowLeft, 
  Sparkles,
  Loader2,
  CheckCircle2,
  Brain,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function FlashcardReview() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const { data, isLoading, refetch } = trpc.flashcards.getDueCards.useQuery(
    { limit: 20 },
    { enabled: !!user }
  );

  const reviewMutation = trpc.flashcards.review.useMutation({
    onSuccess: (result) => {
      toast.success(result.message);
      setReviewedCount(prev => prev + 1);
      
      // Move to next card
      if (currentIndex < (data?.flashcards.length || 0) - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
      }
    },
    onError: (error) => {
      toast.error(`Review failed: ${error.message}`);
    },
  });

  useEffect(() => {
    // Reset flip state when card changes
    setIsFlipped(false);
  }, [currentIndex]);

  if (!user) {
    setLocation("/");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  const flashcards = data?.flashcards || [];
  const currentCard = flashcards[currentIndex];
  const isComplete = currentIndex >= flashcards.length || reviewedCount >= flashcards.length;
  const progress = flashcards.length > 0 ? ((reviewedCount / flashcards.length) * 100) : 0;

  const handleReview = (quality: number) => {
    if (!currentCard) return;
    
    reviewMutation.mutate({
      flashcardId: currentCard.id,
      quality,
    });
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setReviewedCount(0);
    setIsFlipped(false);
    refetch();
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
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Flashcard Review</h1>
                <p className="text-muted-foreground">
                  {isComplete 
                    ? "Review session complete!" 
                    : `Card ${reviewedCount + 1} of ${flashcards.length}`
                  }
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                <span className="text-2xl font-bold">{reviewedCount}</span>
                <span className="text-muted-foreground">/ {flashcards.length}</span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* No Cards Available */}
          {flashcards.length === 0 && !isComplete && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">All caught up!</h2>
                <p className="text-muted-foreground mb-6">
                  No flashcards are due for review right now.
                  <br />
                  Come back later or generate more flashcards from your materials.
                </p>
                <Link href="/dashboard">
                  <Button>Back to Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Review Complete */}
          {isComplete && flashcards.length > 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
                <p className="text-muted-foreground mb-6">
                  You've reviewed {reviewedCount} flashcard{reviewedCount !== 1 ? "s" : ""}.
                  <br />
                  Great job! Keep up the consistent practice.
                </p>
                <div className="flex gap-4">
                  <Button onClick={handleRestart} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Review Again
                  </Button>
                  <Link href="/dashboard">
                    <Button>Back to Dashboard</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Flashcard */}
          {currentCard && !isComplete && (
            <div className="space-y-6">
              {/* Card */}
              <div 
                className="relative h-96 cursor-pointer perspective-1000"
                onClick={handleFlip}
              >
                <div 
                  className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Front */}
                  <Card 
                    className="absolute inset-0 backface-hidden flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-accent/5"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="text-center space-y-4">
                      <Badge variant="outline" className="mb-4">Question</Badge>
                      <p className="text-2xl font-medium leading-relaxed">
                        {currentCard.front}
                      </p>
                      <p className="text-sm text-muted-foreground mt-8">
                        Click to reveal answer
                      </p>
                    </div>
                  </Card>

                  {/* Back */}
                  <Card 
                    className="absolute inset-0 backface-hidden flex items-center justify-center p-8 bg-gradient-to-br from-green-500/5 to-blue-500/5"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <div className="text-center space-y-4">
                      <Badge variant="outline" className="mb-4 bg-green-500/10">Answer</Badge>
                      <p className="text-xl leading-relaxed">
                        {currentCard.back}
                      </p>
                      <div className="mt-8">
                        <Badge 
                          variant={
                            currentCard.difficulty === 'easy' ? 'secondary' :
                            currentCard.difficulty === 'hard' ? 'destructive' :
                            'default'
                          }
                        >
                          {currentCard.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Review Buttons */}
              {isFlipped && (
                <div className="grid grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-1 border-red-500/50 hover:bg-red-500/10"
                    onClick={() => handleReview(0)}
                    disabled={reviewMutation.isPending}
                  >
                    <span className="text-lg font-bold">Again</span>
                    <span className="text-xs text-muted-foreground">&lt;1 day</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-1 border-orange-500/50 hover:bg-orange-500/10"
                    onClick={() => handleReview(1)}
                    disabled={reviewMutation.isPending}
                  >
                    <span className="text-lg font-bold">Hard</span>
                    <span className="text-xs text-muted-foreground">1 day</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-1 border-blue-500/50 hover:bg-blue-500/10"
                    onClick={() => handleReview(3)}
                    disabled={reviewMutation.isPending}
                  >
                    <span className="text-lg font-bold">Good</span>
                    <span className="text-xs text-muted-foreground">6 days</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-1 border-green-500/50 hover:bg-green-500/10"
                    onClick={() => handleReview(5)}
                    disabled={reviewMutation.isPending}
                  >
                    <span className="text-lg font-bold">Easy</span>
                    <span className="text-xs text-muted-foreground">10+ days</span>
                  </Button>
                </div>
              )}

              {/* Hint */}
              {!isFlipped && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Think about your answer, then click the card to check
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
