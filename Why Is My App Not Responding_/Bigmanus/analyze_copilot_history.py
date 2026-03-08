#!/usr/bin/env python3.11
import csv
import json
from datetime import datetime
from collections import defaultdict

# Read the main activity history
print("📊 Analyzing Copilot Activity History...")
print("=" * 60)

conversations = []
date_counts = defaultdict(int)
earliest_date = None
latest_date = None

with open('/home/ubuntu/upload/copilot-activity-historyJan1st.csv', 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for row in reader:
        try:
            timestamp = row.get('Time', '')
            if timestamp:
                date = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                date_counts[date.strftime('%Y-%m')] += 1
                
                if earliest_date is None or date < earliest_date:
                    earliest_date = date
                if latest_date is None or date > latest_date:
                    latest_date = date
                
                conversations.append({
                    'conversation': row.get('Conversation', ''),
                    'time': timestamp,
                    'author': row.get('Author', ''),
                    'message': row.get('Message', '')[:200]  # First 200 chars
                })
        except Exception as e:
            continue

print(f"\n📅 Date Range:")
print(f"   Earliest: {earliest_date.strftime('%Y-%m-%d') if earliest_date else 'N/A'}")
print(f"   Latest: {latest_date.strftime('%Y-%m-%d') if latest_date else 'N/A'}")

print(f"\n📈 Total Messages: {len(conversations)}")

print(f"\n📊 Messages by Month:")
for month in sorted(date_counts.keys()):
    print(f"   {month}: {date_counts[month]} messages")

# Find the earliest 20 conversations
print(f"\n🔍 First 20 Messages (Origin Story):")
print("=" * 60)
sorted_convos = sorted(conversations, key=lambda x: x['time'])[:20]
for i, conv in enumerate(sorted_convos, 1):
    print(f"\n{i}. [{conv['time']}] {conv['author']}")
    print(f"   Conversation: {conv['conversation']}")
    print(f"   Message: {conv['message'][:150]}...")

# Save earliest conversations to file
with open('/home/ubuntu/earliest_conversations.json', 'w') as f:
    json.dump(sorted_convos[:100], f, indent=2)

print(f"\n✅ Saved first 100 conversations to earliest_conversations.json")
