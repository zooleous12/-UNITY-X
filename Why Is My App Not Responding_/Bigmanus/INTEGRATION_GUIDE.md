# 🔌 Lecture Me - Developer Integration Guide

**Version**: 2.0  
**Last Updated**: January 3, 2026  
**Status**: Ready for Production

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Streamlit Integration](#streamlit-integration)
4. [API Reference](#api-reference)
5. [Advanced Patterns](#advanced-patterns)
6. [Troubleshooting](#troubleshooting)

---

## Overview

The new Lecture Me 2.0 modules provide a complete learning ecosystem with:
- **SM-2 Spaced Repetition** for optimal card scheduling
- **Progress Analytics** with achievements and metrics
- **Persistent Settings** with automatic synchronization
- **Unified Integration Layer** for simplified development

### Architecture

```
┌─────────────────────────┐
│   Streamlit UI Layer    │
├─────────────────────────┤
│  LectureMeIntegration   │ ← Central API
├──────┬────────┬─────────┤
│      │        │         │
├──────▼┐ ┌────▼──┐ ┌────▼──┐
│Scheduler│ Progress │ Prefs  │
└────────┘ └────────┘ └────────┘
      │        │         │
      └────────┼─────────┘
               │
         ┌─────▼──────┐
         │Local JSON  │
         │ Storage    │
         └────────────┘
```

---

## Installation

### 1. Import Modules

```python
# In your Streamlit app
from modules.lecture_me_integration import LectureMeIntegration
from modules.spaced_repetition import SpacedRepetitionScheduler
from modules.progress_tracker import ProgressTracker
from modules.user_preferences import UserPreferencesManager
```

### 2. Initialize in Streamlit

```python
import streamlit as st

# Initialize once using session state
if 'lecture_me' not in st.session_state:
    st.session_state.lecture_me = LectureMeIntegration(
        user_id="default_user"
    )
    st.session_state.lecture_me.load_all_data()
```

### 3. Verify Installation

```python
# Test the system
lm = st.session_state.lecture_me
health = lm.get_system_health()
print(health)  # Should show all modules initialized
```

---

## Streamlit Integration

### Pattern 1: Dashboard Tab

```python
import streamlit as st

st.set_page_config(page_title="Lecture Me", page_icon="🎓", layout="wide")

# Initialize
if 'lm' not in st.session_state:
    from modules.lecture_me_integration import LectureMeIntegration
    st.session_state.lm = LectureMeIntegration()
    st.session_state.lm.load_all_data()

lm = st.session_state.lm

# Dashboard
st.title("📊 Learning Dashboard")

col1, col2, col3, col4 = st.columns(4)
with col1:
    st.metric(
        "Study Time",
        f"{lm.progress.user_profile.total_study_time}min"
    )
with col2:
    st.metric(
        "Cards Studied",
        lm.progress.user_profile.total_cards_studied
    )
with col3:
    st.metric(
        "Current Streak",
        f"{lm.progress.user_profile.current_streak}d"
    )
with col4:
    stats = lm.scheduler.get_study_stats()
    st.metric(
        "Accuracy",
        f"{stats.get('accuracy', 0):.0f}%"
    )
```

### Pattern 2: Study Session Tab

```python
def study_tab():
    st.header("🎓 Study Session")
    
    lm = st.session_state.lm
    
    # Select deck
    decks = st.multiselect("Select decks", ["Chemistry", "Biology", "Physics"])
    
    if st.button("Start Session"):
        # Initialize session
        lm.start_study_session(
            session_id=f"session_{datetime.now().timestamp()}",
            deck_ids=decks,
            courses=decks,
            topics=["General Topics"]
        )
        st.session_state.in_session = True
    
    if st.session_state.get('in_session'):
        # Get cards to study
        cards = lm.get_next_study_cards(decks, count=20)
        
        if 'current_card_idx' not in st.session_state:
            st.session_state.current_card_idx = 0
        
        idx = st.session_state.current_card_idx
        
        if idx < len(cards):
            card_id = cards[idx]
            
            # Display card
            st.write(f"Card {idx + 1} of {len(cards)}")
            st.info(f"**Question**: Display your card content here")
            
            # Get response
            col1, col2, col3 = st.columns(3)
            with col1:
                if st.button("😞 Hard", key=f"hard_{idx}"):
                    lm.record_card_review(card_id, 1, 30, False)
                    st.session_state.current_card_idx += 1
                    st.rerun()
            
            with col2:
                if st.button("😐 Medium", key=f"med_{idx}"):
                    lm.record_card_review(card_id, 3, 30, True)
                    st.session_state.current_card_idx += 1
                    st.rerun()
            
            with col3:
                if st.button("😊 Easy", key=f"easy_{idx}"):
                    lm.record_card_review(card_id, 5, 30, True)
                    st.session_state.current_card_idx += 1
                    st.rerun()
        
        else:
            st.success("Session complete!")
            lm.end_study_session()
            lm.save_all_data()
            st.session_state.in_session = False
            if st.button("View results"):
                st.rerun()
```

### Pattern 3: Analytics Tab

```python
def analytics_tab():
    st.header("📈 Learning Analytics")
    
    lm = st.session_state.lm
    
    # Overall stats
    stats = lm.get_user_stats()
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📊 Weekly Summary")
        weekly = stats['this_week']
        st.write(f"**Sessions**: {weekly.get('sessions', 0)}")
        st.write(f"**Cards**: {weekly.get('total_cards_studied', 0)}")
        st.write(f"**Accuracy**: {weekly.get('accuracy', 0):.1f}%")
        st.write(f"**Time**: {weekly.get('total_duration_minutes', 0)} min")
    
    with col2:
        st.subheader("🏆 Achievements")
        achievements = stats['achievements']
        st.write(f"Unlocked: {achievements['unlocked_count']}/{achievements['total_count']}")
        
        for ach in achievements['unlocked']:
            st.success(f"{ach['icon']} {ach['name']}")
    
    # Personalized recommendations
    st.subheader("💡 Recommendations")
    plan = lm.get_personalized_learning_plan(['all_decks'])
    for rec in plan['recommendations']:
        st.info(rec)
```

### Pattern 4: Settings Tab

```python
def settings_tab():
    st.header("⚙️ Settings")
    
    lm = st.session_state.lm
    prefs = lm.preferences
    
    st.subheader("📚 Study Preferences")
    
    new_daily_goal = st.slider(
        "Daily study goal (minutes)",
        min_value=10,
        max_value=240,
        value=prefs.study_preferences.daily_goal_minutes
    )
    
    new_cards_per_session = st.slider(
        "Cards per session",
        min_value=5,
        max_value=100,
        value=prefs.study_preferences.cards_per_session
    )
    
    new_difficulty = st.select_slider(
        "Difficulty level",
        options=["beginner", "intermediate", "advanced"],
        value=prefs.study_preferences.difficulty_level
    )
    
    new_study_time = st.radio(
        "Preferred study time",
        options=["morning", "afternoon", "evening", "anytime"],
        index=["morning", "afternoon", "evening", "anytime"].index(
            prefs.study_preferences.preferred_study_time
        )
    )
    
    if st.button("Save Preferences"):
        prefs.update_preferences(
            daily_goal_minutes=new_daily_goal,
            cards_per_session=new_cards_per_session,
            difficulty_level=new_difficulty,
            preferred_study_time=new_study_time
        )
        lm.save_all_data()
        st.success("Preferences saved!")
    
    st.subheader("💾 Data Management")
    
    if st.button("Export Data"):
        lm.export_user_data("backup.zip")
        st.success("Data exported to backup.zip")
    
    if st.button("Save All Data"):
        lm.save_all_data()
        st.success("Data saved!")
```

---

## API Reference

### LectureMeIntegration

```python
class LectureMeIntegration:
    """Main integration point"""
    
    def __init__(self, user_id: str, data_dir: str)
    def get_user_stats(self) -> Dict[str, Any]
    def get_personalized_learning_plan(self, deck_ids: List[str]) -> Dict
    def start_study_session(self, session_id, deck_ids, courses, topics)
    def record_card_review(self, card_id, difficulty_rating, time_taken, correct)
    def end_study_session(self)
    def get_next_study_cards(self, deck_ids, count) -> List[str]
    def save_all_data()
    def load_all_data()
    def export_user_data(export_path: str)
    def get_system_health() -> Dict
```

### SpacedRepetitionScheduler

```python
class SpacedRepetitionScheduler:
    """SM-2 algorithm implementation"""
    
    def initialize_card(self, card_id) -> CardSchedule
    def record_review(self, card_id, difficulty_rating, time_taken, correct)
    def get_cards_due_for_review() -> List[str]
    def get_study_stats(card_id=None) -> Dict
    def get_learning_forecast(card_id, days_ahead) -> Dict
    def get_deck_review_plan(card_ids) -> Dict
    def save_schedules(filepath)
    def load_schedules(filepath)
```

### ProgressTracker

```python
class ProgressTracker:
    """Learning analytics"""
    
    def start_study_session(self, session_id, courses, topics)
    def end_study_session()
    def record_card_result(self, correct: bool)
    def get_study_summary(days: int) -> Dict
    def get_achievements_summary() -> Dict
    def get_course_performance(course: str) -> Dict
    def save_progress(filepath)
    def load_progress(filepath)
```

### UserPreferencesManager

```python
class UserPreferencesManager:
    """Settings management"""
    
    def start_new_session(self, device_type, ip_address, browser_info)
    def update_preferences(self, **kwargs) -> StudyPreferences
    def update_app_settings(self, **kwargs) -> AppSettings
    def set_deck_preference(self, deck_id, preferences)
    def get_deck_preference(self, deck_id, key, default)
    def set_custom_setting(self, key, value)
    def get_custom_setting(self, key, default)
    def export_all_settings(filepath)
    def import_all_settings(filepath)
    def get_configuration_summary() -> Dict
```

---

## Advanced Patterns

### Custom Recommendation Engine

```python
def get_custom_recommendations(lm):
    """Build custom recommendations"""
    stats = lm.get_user_stats()
    plan = lm.get_personalized_learning_plan(['all_decks'])
    
    recommendations = []
    
    # Add custom logic
    if stats['profile']['current_streak'] == 0:
        recommendations.append("🔥 Start your streak today!")
    
    if stats['this_week']['accuracy'] < 70:
        recommendations.append("📚 Focus on reviewing weak areas")
    
    return recommendations
```

### Multi-User Management

```python
# Support multiple users
users = ["student1", "student2", "student3"]

def get_user_instance(user_id):
    if f'lm_{user_id}' not in st.session_state:
        st.session_state[f'lm_{user_id}'] = LectureMeIntegration(user_id)
    return st.session_state[f'lm_{user_id}']

# Use it
current_user = st.selectbox("Select user", users)
lm = get_user_instance(current_user)
```

### Real-time Progress Updates

```python
# Auto-save after each action
def safe_record_review(lm, card_id, rating, time, correct):
    try:
        lm.record_card_review(card_id, rating, time, correct)
        lm.save_all_data()
        return True
    except Exception as e:
        st.error(f"Error recording review: {e}")
        return False
```

### Data Migration

```python
def migrate_user_data(old_user_id, new_user_id):
    """Migrate from one user to another"""
    old_lm = LectureMeIntegration(old_user_id)
    old_lm.load_all_data()
    
    # Export
    old_lm.export_user_data("migration.zip")
    
    # Import to new user
    new_lm = LectureMeIntegration(new_user_id)
    new_lm.preferences.import_all_settings("migration.json")
    new_lm.save_all_data()
    
    return new_lm
```

---

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'modules'"

**Solution**: Make sure you're running from the correct directory
```bash
cd lecture_me_complete_app
python -m streamlit run app.py
```

### Issue: Data not persisting

**Solution**: Call save_all_data() explicitly
```python
lm.record_card_review(...)
lm.save_all_data()  # <- Important!
```

### Issue: Settings reset after reload

**Solution**: Load data on app start
```python
if 'lm' not in st.session_state:
    lm = LectureMeIntegration()
    lm.load_all_data()  # <- Important!
    st.session_state.lm = lm
```

### Issue: Session state not updating

**Solution**: Use st.rerun() after state changes
```python
lm.record_card_review(...)
st.session_state.updated = True
st.rerun()
```

---

## Performance Tips

1. **Load once**: Initialize once per app run
2. **Cache data**: Use @st.cache_data for expensive operations
3. **Batch saves**: Save every 10 actions, not every action
4. **Clean old data**: Periodically remove old sessions

```python
@st.cache_data
def get_scheduler():
    lm = LectureMeIntegration()
    lm.load_all_data()
    return lm
```

---

## Security Considerations

1. **User isolation**: Each user_id gets separate data
2. **Local storage**: Data never leaves the device