User Preferences and Session Management Module for Lecture Me
Handles user settings, preferences, and local session persistence
"""

import json
import logging
from typing import Dict, Any, Optional
from dataclasses import dataclass, field, asdict
from datetime import datetime
import os

@dataclass
class StudyPreferences:
    """User study preferences"""
    daily_goal_minutes: int = 30
    cards_per_session: int = 20
    minimum_interval_days: int = 1
    maximum_daily_cards: int = 100
    enable_audio: bool = True
    enable_notifications: bool = True
    preferred_study_time: str = "evening"  # morning, afternoon, evening, anytime
    dark_mode: bool = False
    language: str = "en"
    difficulty_level: str = "intermediate"  # beginner, intermediate, advanced

@dataclass
class AppSettings:
    """Application-wide settings"""
    auto_save_interval: int = 300  # seconds
    max_cache_size: int = 500  # MB
    api_timeout: int = 30  # seconds
    max_file_upload_size: int = 500  # MB
    enable_telemetry: bool = False
    data_backup_enabled: bool = True
    backup_frequency: str = "daily"  # daily, weekly, monthly

@dataclass
class UserSession:
    """Active user session"""
    session_id: str
    user_id: str
    created_at: str
    last_activity: str
    device_type: str
    ip_address: Optional[str] = None
    browser_info: Optional[str] = None

class UserPreferencesManager:
    """
    Manages user preferences and application settings
    Provides persistent storage and configuration
    """
    
    def __init__(self, user_id: str = "default", config_dir: str = ".lecture_me"):
        """
        Initialize preferences manager
        
        Args:
            user_id: Unique user identifier
            config_dir: Directory for storing configuration files
        """
        self.setup_logging()
        self.user_id = user_id
        self.config_dir = config_dir
        self._ensure_config_dir()
        
        self.study_preferences = StudyPreferences()
        self.app_settings = AppSettings()
        self.user_session: Optional[UserSession] = None
        self.deck_settings: Dict[str, Dict] = {}
        self.custom_settings: Dict[str, Any] = {}
        
        self._load_all_settings()
    
    def setup_logging(self):
        """Setup logging"""
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
    
    def _ensure_config_dir(self):
        """Ensure configuration directory exists"""
        os.makedirs(self.config_dir, exist_ok=True)
        self.logger.info(f"Configuration directory: {self.config_dir}")
    
    def _get_preferences_file(self) -> str:
        """Get path to preferences file"""
        return os.path.join(self.config_dir, f"preferences_{self.user_id}.json")
    
    def _get_settings_file(self) -> str:
        """Get path to settings file"""
        return os.path.join(self.config_dir, f"settings_{self.user_id}.json")
    
    def _get_session_file(self) -> str:
        """Get path to session file"""
        return os.path.join(self.config_dir, f"session_{self.user_id}.json")
    
    def _get_deck_settings_file(self) -> str:
        """Get path to deck settings file"""
        return os.path.join(self.config_dir, f"deck_settings_{self.user_id}.json")