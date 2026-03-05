/**
 * Spaced Repetition System - SM-2 Algorithm Implementation
 * 
 * The SM-2 algorithm calculates optimal review intervals based on user performance.
 * Quality ratings: 0-5 (0 = complete blackout, 5 = perfect response)
 * 
 * Standard intervals:
 * - First review: 1 day
 * - Second review: 6 days
 * - Subsequent reviews: previous_interval * ease_factor
 * 
 * Ease factor adjusts based on performance (starts at 2.5, minimum 1.3)
 */

export interface SM2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
}

/**
 * Calculate next review parameters using SM-2 algorithm
 * 
 * @param quality - User's performance rating (0-5)
 *   5 - perfect response
 *   4 - correct response after hesitation
 *   3 - correct response with difficulty
 *   2 - incorrect response; correct one remembered
 *   1 - incorrect response; correct one seemed easy to recall
 *   0 - complete blackout
 * 
 * @param currentEaseFactor - Current ease factor (default 2.5)
 * @param currentInterval - Current interval in days (default 0)
 * @param currentRepetitions - Number of consecutive correct reviews (default 0)
 * 
 * @returns SM2Result with updated parameters
 */
export function calculateSM2(
  quality: number,
  currentEaseFactor: number = 2.5,
  currentInterval: number = 0,
  currentRepetitions: number = 0
): SM2Result {
  // Validate quality rating
  if (quality < 0 || quality > 5) {
    throw new Error("Quality must be between 0 and 5");
  }

  let easeFactor = currentEaseFactor;
  let interval = currentInterval;
  let repetitions = currentRepetitions;

  // Update ease factor based on quality
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Ensure ease factor doesn't go below 1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // If quality < 3, reset repetitions and start over
  if (quality < 3) {
    repetitions = 0;
    interval = 1; // Review again tomorrow
  } else {
    // Increment repetitions
    repetitions += 1;

    // Calculate new interval
    if (repetitions === 1) {
      interval = 1; // First review: 1 day
    } else if (repetitions === 2) {
      interval = 6; // Second review: 6 days
    } else {
      // Subsequent reviews: previous interval * ease factor
      interval = Math.round(interval * easeFactor);
    }
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    easeFactor: Math.round(easeFactor * 100) / 100, // Round to 2 decimal places
    interval,
    repetitions,
    nextReviewDate,
  };
}

/**
 * Map user-friendly button labels to SM-2 quality ratings
 */
export const QUALITY_RATINGS = {
  AGAIN: 0,  // Complete failure - review immediately
  HARD: 2,   // Difficult but eventually recalled
  GOOD: 4,   // Correct with minor hesitation
  EASY: 5,   // Perfect recall, no hesitation
} as const;

/**
 * Get human-readable description of quality rating
 */
export function getQualityDescription(quality: number): string {
  switch (quality) {
    case 0:
      return "Complete blackout - couldn't recall";
    case 1:
      return "Incorrect, but correct answer seemed familiar";
    case 2:
      return "Incorrect initially, but correct answer remembered";
    case 3:
      return "Correct with serious difficulty";
    case 4:
      return "Correct with hesitation";
    case 5:
      return "Perfect recall";
    default:
      return "Unknown quality";
  }
}

/**
 * Get next interval preview for each quality rating
 * Useful for showing users what will happen when they click each button
 */
export function getIntervalPreviews(
  currentEaseFactor: number,
  currentInterval: number,
  currentRepetitions: number
): Record<keyof typeof QUALITY_RATINGS, string> {
  const results = {
    AGAIN: calculateSM2(QUALITY_RATINGS.AGAIN, currentEaseFactor, currentInterval, currentRepetitions),
    HARD: calculateSM2(QUALITY_RATINGS.HARD, currentEaseFactor, currentInterval, currentRepetitions),
    GOOD: calculateSM2(QUALITY_RATINGS.GOOD, currentEaseFactor, currentInterval, currentRepetitions),
    EASY: calculateSM2(QUALITY_RATINGS.EASY, currentEaseFactor, currentInterval, currentRepetitions),
  };

  return {
    AGAIN: formatInterval(results.AGAIN.interval),
    HARD: formatInterval(results.HARD.interval),
    GOOD: formatInterval(results.GOOD.interval),
    EASY: formatInterval(results.EASY.interval),
  };
}

/**
 * Format interval in human-readable form
 */
export function formatInterval(days: number): string {
  if (days === 0) return "Now";
  if (days === 1) return "1 day";
  if (days < 30) return `${days} days`;
  if (days < 365) {
    const months = Math.round(days / 30);
    return months === 1 ? "1 month" : `${months} months`;
  }
  const years = Math.round(days / 365);
  return years === 1 ? "1 year" : `${years} years`;
}

/**
 * Calculate review statistics
 */
export interface ReviewStats {
  totalCards: number;
  newCards: number;
  learningCards: number;
  matureCards: number;
  dueToday: number;
  averageEaseFactor: number;
  retentionRate: number;
}

/**
 * Categorize card maturity based on repetitions
 */
export function getCardMaturity(repetitions: number): "new" | "learning" | "mature" {
  if (repetitions === 0) return "new";
  if (repetitions < 3) return "learning";
  return "mature";
}
