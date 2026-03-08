                achievement_id="week_warrior",
                name="Week Warrior",
                description="Study for 7 consecutive days",
                icon="⚔️",
                target=7
            ),
            Achievement(
                achievement_id="century_club",
                name="Century Club",
                description="Study 100 flashcards in one day",
                icon="💯",
                target=100
            ),
            Achievement(
                achievement_id="accuracy_master",
                name="Accuracy Master",
                description="Achieve 95% accuracy on a deck",
                icon="🎯",
                target=95
            ),
            Achievement(
                achievement_id="knowledge_keeper",
                name="Knowledge Keeper",
                description="Complete 50 study sessions",
                icon="📚",
                target=50
            ),
            Achievement(
                achievement_id="speed_reader",
                name="Speed Reader",
                description="Complete a session in under 15 minutes",
                icon="⚡",
                target=1
            ),
            Achievement(
                achievement_id="dedicated_learner",
                name="Dedicated Learner",
                description="Study for 100 total hours",
                icon="🏆",
                target=100
            ),
            Achievement(
                achievement_id="multi_tasker",
                name="Multi-Tasker",
                description="Study 5 different subjects",
                icon="🎓",
                target=5
            ),
        ]
        
        for achievement in achievements_list:
            self.achievements[achievement.achievement_id] = achievement
    
    def start_study_session(self, session_id: str, courses: List[str] = None, 
                           topics: List[str] = None) -> str:
        """
        Start a new study session
        
        Args:
            session_id: Unique session identifier
            courses: List of courses being studied
            topics: List of topics being studied
            
        Returns:
            Session ID
        """
        self.current_session = {
            'session_id': session_id,
            'start_time': datetime.now(),
            'courses': courses or [],
            'topics': topics or [],
            'cards_studied': 0,
            'correct_answers': 0,
            'incorrect_answers': 0
        }
        self.logger.info(f"Started study session: {session_id}")
        return session_id
    
    def end_study_session(self):
        """End current study session and record data"""
        if not hasattr(self, 'current_session'):
            return
        
        session = self.current_session
        end_time = datetime.now()
        start_time = session['start_time']
        duration = int((end_time - start_time).total_seconds() / 60)
        
        # Create session record
        study_session = StudySession(
            session_id=session['session_id'],
            start_time=start_time.isoformat(),
            end_time=end_time.isoformat(),
            duration_minutes=duration,
            cards_studied=session['cards_studied'],
            correct_answers=session['correct_answers'],
            incorrect_answers=session['incorrect_answers'],
            courses=session['courses'],
            topics=session['topics']
        )