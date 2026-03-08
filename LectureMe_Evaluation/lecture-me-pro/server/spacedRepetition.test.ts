import { describe, it, expect } from "vitest";
import { calculateSM2, QUALITY_RATINGS, getCardMaturity, formatInterval } from "./spacedRepetition";

describe("Spaced Repetition - SM-2 Algorithm", () => {
  describe("calculateSM2", () => {
    it("should initialize new card correctly", () => {
      const result = calculateSM2(QUALITY_RATINGS.GOOD, 2.5, 0, 0);
      
      expect(result.easeFactor).toBe(2.5);
      expect(result.interval).toBe(1); // First review: 1 day
      expect(result.repetitions).toBe(1);
      expect(result.nextReviewDate).toBeInstanceOf(Date);
    });

    it("should progress to second review after good performance", () => {
      const result = calculateSM2(QUALITY_RATINGS.GOOD, 2.5, 1, 1);
      
      expect(result.easeFactor).toBe(2.5);
      expect(result.interval).toBe(6); // Second review: 6 days
      expect(result.repetitions).toBe(2);
    });

    it("should calculate exponential intervals after second review", () => {
      const result = calculateSM2(QUALITY_RATINGS.GOOD, 2.5, 6, 2);
      
      expect(result.easeFactor).toBe(2.5);
      expect(result.interval).toBe(15); // 6 * 2.5 = 15 days
      expect(result.repetitions).toBe(3);
    });

    it("should reset repetitions on poor performance", () => {
      const result = calculateSM2(QUALITY_RATINGS.AGAIN, 2.5, 15, 3);
      
      expect(result.interval).toBe(1); // Reset to 1 day
      expect(result.repetitions).toBe(0); // Reset repetitions
      expect(result.easeFactor).toBeLessThan(2.5); // Ease factor decreases
    });

    it("should increase ease factor on easy performance", () => {
      const result = calculateSM2(QUALITY_RATINGS.EASY, 2.5, 1, 1);
      
      expect(result.easeFactor).toBeGreaterThan(2.5);
      expect(result.interval).toBe(6); // Still follows standard progression
      expect(result.repetitions).toBe(2);
    });

    it("should decrease ease factor on hard performance", () => {
      const result = calculateSM2(QUALITY_RATINGS.HARD, 2.5, 1, 1);
      
      expect(result.easeFactor).toBeLessThan(2.5);
      // HARD (quality 2) resets because it's < 3
      expect(result.interval).toBe(1); // Reset to 1 day
      expect(result.repetitions).toBe(0); // Reset repetitions
    });

    it("should not allow ease factor below 1.3", () => {
      // Repeatedly fail to drive ease factor down
      let easeFactor = 2.5;
      for (let i = 0; i < 10; i++) {
        const result = calculateSM2(QUALITY_RATINGS.AGAIN, easeFactor, 1, 0);
        easeFactor = result.easeFactor;
      }
      
      expect(easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it("should throw error for invalid quality rating", () => {
      expect(() => calculateSM2(6, 2.5, 0, 0)).toThrow("Quality must be between 0 and 5");
      expect(() => calculateSM2(-1, 2.5, 0, 0)).toThrow("Quality must be between 0 and 5");
    });

    it("should calculate correct next review date", () => {
      const result = calculateSM2(QUALITY_RATINGS.GOOD, 2.5, 0, 0);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Check that the date is approximately tomorrow (within 1 hour tolerance)
      const timeDiff = Math.abs(result.nextReviewDate.getTime() - tomorrow.getTime());
      expect(timeDiff).toBeLessThan(3600000); // 1 hour in milliseconds
    });
  });

  describe("Quality Ratings", () => {
    it("should have correct quality rating values", () => {
      expect(QUALITY_RATINGS.AGAIN).toBe(0);
      expect(QUALITY_RATINGS.HARD).toBe(2);
      expect(QUALITY_RATINGS.GOOD).toBe(4);
      expect(QUALITY_RATINGS.EASY).toBe(5);
    });
  });

  describe("Card Maturity", () => {
    it("should categorize new cards correctly", () => {
      expect(getCardMaturity(0)).toBe("new");
    });

    it("should categorize learning cards correctly", () => {
      expect(getCardMaturity(1)).toBe("learning");
      expect(getCardMaturity(2)).toBe("learning");
    });

    it("should categorize mature cards correctly", () => {
      expect(getCardMaturity(3)).toBe("mature");
      expect(getCardMaturity(10)).toBe("mature");
    });
  });

  describe("Format Interval", () => {
    it("should format short intervals correctly", () => {
      expect(formatInterval(0)).toBe("Now");
      expect(formatInterval(1)).toBe("1 day");
      expect(formatInterval(7)).toBe("7 days");
      expect(formatInterval(14)).toBe("14 days");
    });

    it("should format month intervals correctly", () => {
      expect(formatInterval(30)).toBe("1 month");
      expect(formatInterval(60)).toBe("2 months");
      expect(formatInterval(90)).toBe("3 months");
    });

    it("should format year intervals correctly", () => {
      expect(formatInterval(365)).toBe("1 year");
      expect(formatInterval(730)).toBe("2 years");
    });
  });

  describe("Real-world Learning Scenarios", () => {
    it("should handle perfect learner progression", () => {
      // Day 1: First review
      let result = calculateSM2(QUALITY_RATINGS.EASY, 2.5, 0, 0);
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(1);

      // Day 2: Second review
      result = calculateSM2(QUALITY_RATINGS.EASY, result.easeFactor, result.interval, result.repetitions);
      expect(result.interval).toBe(6);
      expect(result.repetitions).toBe(2);

      // Day 8: Third review
      result = calculateSM2(QUALITY_RATINGS.EASY, result.easeFactor, result.interval, result.repetitions);
      expect(result.interval).toBeGreaterThan(15);
      expect(result.repetitions).toBe(3);
      expect(result.easeFactor).toBeGreaterThan(2.5);
    });

    it("should handle struggling learner with recovery", () => {
      // Day 1: First review - forgot
      let result = calculateSM2(QUALITY_RATINGS.AGAIN, 2.5, 0, 0);
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(0);

      // Day 2: Try again - still hard (resets again)
      result = calculateSM2(QUALITY_RATINGS.HARD, result.easeFactor, result.interval, result.repetitions);
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(0); // Still reset because HARD < 3

      // Day 3: Getting better (first successful review after reset)
      result = calculateSM2(QUALITY_RATINGS.GOOD, result.easeFactor, result.interval, result.repetitions);
      expect(result.interval).toBe(1); // First review after reset
      expect(result.repetitions).toBe(1);

      // Eventually recovers (second successful review)
      result = calculateSM2(QUALITY_RATINGS.GOOD, result.easeFactor, result.interval, result.repetitions);
      expect(result.repetitions).toBe(2); // Second review
      expect(result.interval).toBe(6); // Second review interval
      expect(result.easeFactor).toBeGreaterThan(1.3);
    });

    it("should handle mixed performance over time", () => {
      let result = calculateSM2(QUALITY_RATINGS.GOOD, 2.5, 0, 0);
      expect(result.repetitions).toBe(1);

      result = calculateSM2(QUALITY_RATINGS.EASY, result.easeFactor, result.interval, result.repetitions);
      expect(result.repetitions).toBe(2);

      // HARD (quality 2) resets repetitions because it's < 3
      result = calculateSM2(QUALITY_RATINGS.HARD, result.easeFactor, result.interval, result.repetitions);
      expect(result.repetitions).toBe(0); // Reset!
      expect(result.interval).toBe(1); // Back to 1 day

      // Recover with good performance
      result = calculateSM2(QUALITY_RATINGS.GOOD, result.easeFactor, result.interval, result.repetitions);
      expect(result.repetitions).toBe(1);

      // Ease factor should have adjusted based on mixed performance
      expect(result.easeFactor).toBeGreaterThan(1.3);
      expect(result.easeFactor).toBeLessThan(3.0);
    });
  });
});
