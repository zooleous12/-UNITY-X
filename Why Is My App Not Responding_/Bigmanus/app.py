Lecture Me - AI-Powered Study Guide Generator
Complete application for converting lectures and textbooks into study materials
Enhanced with revolutionary document scanning and proactive learning features
"""

import streamlit as st
import os
import tempfile
import zipfile
from pathlib import Path
import json
from datetime import datetime
import cv2
import numpy as np

# Import our modules
from modules.audio_processor import AudioProcessor
from modules.pdf_processor import PDFProcessor
from modules.study_guide_generator import StudyGuideGenerator
from modules.flashcard_generator import FlashcardGenerator
from modules.textbook_processor import TextbookProcessor
from modules.document_scanner import DocumentScanner
from modules.voice_guide import VoiceGuide
from modules.photo_processor import PhotoProcessor
from modules.video_scanner import VideoScanner
from modules.weakness_analyzer import WeaknessAnalyzer

# Page config
st.set_page_config(
    page_title="Lecture Me - AI Study Guide Generator",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin-bottom: 2rem;
    }
    .feature-card {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 10px;
        border-left: 4px solid #667eea;
        margin: 1rem 0;
    }
    .success-box {
        background: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
        padding: 1rem;
        border-radius: 5px;
        margin: 1rem 0;
    }
    .pricing-card {
        background: white;
        border: 2px solid #e9ecef;
        border-radius: 10px;
        padding: 2rem;
        text-align: center;
        margin: 1rem;
        transition: transform 0.3s;
    }
    .pricing-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    .popular {
        border-color: #667eea;
        position: relative;
    }
    .popular::before {
        content: "MOST POPULAR";
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        background: #667eea;
        color: white;
        padding: 5px 15px;
        border-radius: 15px;
        font-size: 12px;
        font-weight: bold;
    }
</style>
""", unsafe_allow_html=True)

def main():
    # Header
    st.markdown("""
    <div class="main-header">
        <h1>🎓 Lecture Me</h1>