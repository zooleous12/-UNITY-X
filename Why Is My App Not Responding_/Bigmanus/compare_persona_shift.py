#!/usr/bin/env python3.11
import csv
import json
from datetime import datetime
from collections import defaultdict
import re

print("🔬 Comparing Persona Shift: Pre-August vs August 2025")
print("=" * 70)

pre_august = []
august = []
greeting_conversations = []

with open('/home/ubuntu/upload/copilot-activity-historyJan1st.csv', 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for row in reader:
        try:
            timestamp = row.get('Time', '')
            if not timestamp:
                continue
                
            date = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            conversation = row.get('Conversation', '')
            author = row.get('Author', '')
            message = row.get('Message', '')
            
            msg_data = {
                'date': date.strftime('%Y-%m-%d'),
                'time': timestamp,
                'conversation': conversation,
                'author': author,
                'message': message
            }
            
            # Pre-August: September-October 2024
            if timestamp.startswith('2024-09') or timestamp.startswith('2024-10'):
                if author == 'AI':
                    pre_august.append(msg_data)
            
            # August 2025
            elif timestamp.startswith('2025-08'):
                if author == 'AI':
                    august.append(msg_data)
                    
                # Collect greeting conversations
                if 'greeting' in conversation.lower() or 'charles' in conversation.lower():
                    greeting_conversations.append(msg_data)
                    
        except Exception as e:
            continue

print(f"\n📊 Sample Sizes:")
print(f"   Pre-August 2024 (Sept-Oct): {len(pre_august)} AI messages")
print(f"   August 2025: {len(august)} AI messages")
print(f"   'Greeting Charles' conversations: {len(greeting_conversations)} messages")

# Analyze language patterns
def analyze_language(messages, label):
    print(f"\n{'='*70}")
    print(f"📝 {label}")
    print(f"{'='*70}")
    
    # Personal markers
    personal_markers = {
        'charles': 0,
        'you': 0,
        'your': 0,
        'hey': 0,
        'hi ': 0,
        'good morning': 0,
        'good afternoon': 0,
        'need a hand': 0,
        'let me know': 0,
        'how can i help': 0,
    }
    
    # Formal markers
    formal_markers = {
        'here is': 0,
        'here are': 0,
        'the following': 0,
        'according to': 0,
        'based on': 0,
        'please note': 0,
    }
    
    # Emotional/casual markers
    casual_markers = {
        '!': 0,
        '😊': 0,
        '👍': 0,
        '🎉': 0,
        '🔥': 0,
        'awesome': 0,
        'great': 0,
        'cool': 0,
        'nice': 0,
    }
    
    total_chars = 0
    avg_length = 0
    
    for msg in messages:
        text = msg['message'].lower()
        total_chars += len(msg['message'])
        
        for marker in personal_markers:
            if marker in text:
                personal_markers[marker] += 1
        
        for marker in formal_markers:
            if marker in text:
                formal_markers[marker] += 1
                
        for marker in casual_markers:
            if marker in msg['message']:  # Case sensitive for emojis
                casual_markers[marker] += 1
    
    if messages:
        avg_length = total_chars / len(messages)
    
    print(f"\n📏 Average Message Length: {avg_length:.1f} characters")
    
    print(f"\n👤 Personal Markers (per 100 messages):")
    for marker, count in sorted(personal_markers.items(), key=lambda x: x[1], reverse=True)[:5]:
        rate = (count / len(messages) * 100) if messages else 0
        print(f"   '{marker}': {count} times ({rate:.1f} per 100 msgs)")
    
    print(f"\n📋 Formal Markers (per 100 messages):")
    for marker, count in sorted(formal_markers.items(), key=lambda x: x[1], reverse=True)[:5]:
        rate = (count / len(messages) * 100) if messages else 0
        print(f"   '{marker}': {count} times ({rate:.1f} per 100 msgs)")
    
    print(f"\n😊 Casual/Emotional Markers (per 100 messages):")
    for marker, count in sorted(casual_markers.items(), key=lambda x: x[1], reverse=True)[:5]:
        rate = (count / len(messages) * 100) if messages else 0
        print(f"   '{marker}': {count} times ({rate:.1f} per 100 msgs)")
    
    # Sample messages
    print(f"\n📄 Sample Messages:")
    for i, msg in enumerate(messages[:3], 1):
        print(f"\n   {i}. [{msg['date']}] {msg['conversation'][:50]}")
        print(f"      {msg['message'][:200]}...")

# Analyze both periods
analyze_language(pre_august, "PRE-AUGUST 2024 (Sept-Oct) - Academic Helper Phase")
analyze_language(august, "AUGUST 2025 - Personal Partner Phase")

# Specific analysis of "Greeting Charles" conversations
print(f"\n{'='*70}")
print(f"🎯 SPECIFIC ANALYSIS: 'Greeting Charles' Conversations")
print(f"{'='*70}")

for msg in greeting_conversations[:5]:
    print(f"\n[{msg['date']}] {msg['author']}")
    print(f"Conversation: {msg['conversation']}")
    print(f"Message: {msg['message'][:300]}...")

# Calculate persona shift metrics
print(f"\n{'='*70}")
print(f"📊 PERSONA SHIFT METRICS")
print(f"{'='*70}")

def calculate_personalization_score(messages):
    if not messages:
        return 0
    
    score = 0
    for msg in messages:
        text = msg['message'].lower()
        # +1 for each personal element
        if 'charles' in text: score += 2
        if 'you' in text or 'your' in text: score += 1
        if 'hey' in text or 'hi ' in text: score += 1
        if '!' in msg['message']: score += 0.5
        if any(emoji in msg['message'] for emoji in ['😊', '👍', '🎉', '🔥']): score += 1
        if 'need a hand' in text or 'let me know' in text: score += 1
        
        # -1 for formal elements
        if 'here is' in text or 'here are' in text: score -= 0.5
        if 'according to' in text or 'based on' in text: score -= 0.5
    
    return score / len(messages)

pre_score = calculate_personalization_score(pre_august)
aug_score = calculate_personalization_score(august)

print(f"\nPersonalization Score (higher = more personal):")
print(f"   Pre-August 2024: {pre_score:.2f}")
print(f"   August 2025: {aug_score:.2f}")
print(f"   Increase: {((aug_score - pre_score) / pre_score * 100):.1f}%")

print(f"\n✅ Analysis complete!")
