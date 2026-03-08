Spaced Repetition Algorithm Module for Lecture Me
Implements smart scheduling based on SM-2 (SuperMemo 2) algorithm for optimal learning
"""

import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from enum import Enum
import math

class CardDifficulty(Enum):
    """Card difficulty levels"""
    EASY = 5
    MEDIUM = 3
    HARD = 1

@dataclass
class CardReview:
    """Record of a single card review"""
    timestamp: str
    difficulty_rating: int  # 1-5 scale
    time_taken: int  # seconds
    correct: bool
    
@dataclass
class CardSchedule:
    """Spaced repetition schedule for a card"""
    card_id: str
    next_review: str  # ISO format datetime
    interval: int  # days until next review
    easiness_factor: float  # SM-2 easiness factor
    repetitions: int  # number of times reviewed
    reviews: List[CardReview]
    current_streak: int  # consecutive correct answers
    
class SpacedRepetitionScheduler:
    """
    Smart scheduling system using SuperMemo 2 algorithm
    Optimizes review timing based on user performance
    """
    
    def __init__(self):
        """Initialize the spaced repetition scheduler"""
        self.setup_logging()
        self.schedules: Dict[str, CardSchedule] = {}
        self.default_easiness = 2.5
        self.min_easiness = 1.3
        
    def setup_logging(self):
        """Setup logging"""
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
    
    def initialize_card(self, card_id: str) -> CardSchedule:
        """
        Initialize schedule for a new card
        
        Args:
            card_id: Unique card identifier
            
        Returns:
            Initial CardSchedule
        """
        schedule = CardSchedule(
            card_id=card_id,
            next_review=datetime.now().isoformat(),
            interval=1,
            easiness_factor=self.default_easiness,
            repetitions=0,
            reviews=[],
            current_streak=0
        )
        self.schedules[card_id] = schedule
        return schedule
    
    def record_review(self, card_id: str, difficulty_rating: int, 
                     time_taken: int = 0, correct: bool = True) -> CardSchedule:
        """
        Record a review and update schedule using SM-2 algorithm
        
        Args:
            card_id: Card identifier
            difficulty_rating: 1-5 rating (1=hard, 5=easy)
            time_taken: Time spent on card in seconds
            correct: Whether answer was correct
            
        Returns:
            Updated CardSchedule
        """
        if card_id not in self.schedules:
            self.initialize_card(card_id)
        
        schedule = self.schedules[card_id]
        
        # Record the review
        review = CardReview(
            timestamp=datetime.now().isoformat(),
            difficulty_rating=difficulty_rating,
            time_taken=time_taken,
            correct=correct
        )
        schedule.reviews.append(review)
        
        # Update streak
        if correct:
            schedule.current_streak += 1
        else:
            schedule.current_streak = 0
        
        # Calculate new interval and easiness using SM-2
        if schedule.repetitions == 0:
            # First review
            new_interval = 1
            schedule.repetitions = 1
        elif schedule.repetitions == 1:
            # Second review
            new_interval = 3
            schedule.repetitions = 2
        else:
            # Subsequent reviews
            schedule.repetitions += 1
            new_interval = int(schedule.interval * schedule.easiness_factor)
        
        # Update easiness factor (SM-2 formula)
        # EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        # where q is the quality rating (0-5)
        q = difficulty_rating
        new_easiness = schedule.easiness_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        schedule.easiness_factor = max(self.min_easiness, new_easiness)
        
        # Adjust interval based on correctness
        if not correct and schedule.repetitions > 1:
            schedule.repetitions = 1
            new_interval = 1
        
        # Update schedule
        schedule.interval = max(1, new_interval)
        schedule.next_review = (datetime.now() + timedelta(days=new_interval)).isoformat()
        
        self.logger.info(f"Card {card_id}: interval={new_interval}d, "
                        f"easiness={schedule.easiness_factor:.2f}, "
                        f"reps={schedule.repetitions}, streak={schedule.current_streak}")
        
        return schedule
    
    def get_cards_due_for_review(self) -> List[str]:
        """