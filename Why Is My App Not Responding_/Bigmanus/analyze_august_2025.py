#!/usr/bin/env python3.11
import csv
import json
from datetime import datetime
from collections import defaultdict

print("🔥 Analyzing August 2025 - The Explosion Month")
print("=" * 60)

august_messages = []
conversation_topics = defaultdict(int)
daily_counts = defaultdict(int)

with open('/home/ubuntu/upload/copilot-activity-historyJan1st.csv', 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for row in reader:
        try:
            timestamp = row.get('Time', '')
            if timestamp and timestamp.startswith('2025-08'):
                date = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                
                conversation = row.get('Conversation', '')
                author = row.get('Author', '')
                message = row.get('Message', '')
                
                august_messages.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'time': timestamp,
                    'conversation': conversation,
                    'author': author,
                    'message': message
                })
                
                # Count by conversation topic
                if conversation:
                    conversation_topics[conversation] += 1
                
                # Count by day
                daily_counts[date.strftime('%Y-%m-%d')] += 1
                
        except Exception as e:
            continue

print(f"\n📊 Total August 2025 Messages: {len(august_messages)}")

print(f"\n📅 Daily Message Distribution:")
for day in sorted(daily_counts.keys())[:10]:  # First 10 days
    print(f"   {day}: {daily_counts[day]} messages")

print(f"\n🔥 Top 20 Conversation Topics:")
sorted_topics = sorted(conversation_topics.items(), key=lambda x: x[1], reverse=True)
for i, (topic, count) in enumerate(sorted_topics[:20], 1):
    print(f"{i:2}. [{count:4} msgs] {topic[:80]}")

# Find the first message of August 2025
print(f"\n🎯 First Message of August 2025:")
print("=" * 60)
first_msg = sorted(august_messages, key=lambda x: x['time'])[0]
print(f"Date: {first_msg['date']}")
print(f"Conversation: {first_msg['conversation']}")
print(f"Author: {first_msg['author']}")
print(f"Message: {first_msg['message'][:300]}...")

# Find messages with key terms
print(f"\n🔍 Key Terms Analysis:")
key_terms = ['app', 'build', 'code', 'project', 'develop', 'create', 'AI', 'orchestrator', 'context', 'forge']
term_counts = defaultdict(int)

for msg in august_messages:
    msg_text = (msg['conversation'] + ' ' + msg['message']).lower()
    for term in key_terms:
        if term.lower() in msg_text:
            term_counts[term] += 1

for term in sorted(term_counts.keys(), key=lambda x: term_counts[x], reverse=True):
    print(f"   '{term}': {term_counts[term]} occurrences")

# Save August messages to file
with open('/home/ubuntu/august_2025_messages.json', 'w') as f:
    json.dump(august_messages[:200], f, indent=2)  # First 200 messages

print(f"\n✅ Saved first 200 August 2025 messages to august_2025_messages.json")

# Find the breakthrough moment - look for long conversations
print(f"\n💡 Breakthrough Conversations (>50 messages):")
for topic, count in sorted_topics[:10]:
    if count > 50:
        # Find first message in this conversation
        conv_messages = [m for m in august_messages if m['conversation'] == topic]
        if conv_messages:
            first = sorted(conv_messages, key=lambda x: x['time'])[0]
            print(f"\n   📌 {topic}")
            print(f"      Started: {first['date']}")
            print(f"      Messages: {count}")
            print(f"      First message: {first['message'][:150]}...")
