#!/usr/bin/env python3
"""
Deep analysis of agent conversations to reconstruct activities and patterns.
"""

import json
import re
from datetime import datetime
from pathlib import Path
from collections import defaultdict

def load_json_file(filepath):
    """Load a JSON file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def parse_message_content(msg):
    """Parse message content to extract readable text."""
    content = msg.get('content', '')
    msg_type = msg.get('type', '')
    
    # For user messages, try to extract from JSON
    if msg_type == 'user':
        try:
            if isinstance(content, str) and content.startswith('{'):
                content_obj = json.loads(content)
                if 'content' in content_obj:
                    return content_obj['content']
        except:
            pass
    
    # For assistant messages, check metadata for tool calls
    if msg_type == 'assistant':
        metadata = msg.get('metadata', {})
        if isinstance(metadata, dict):
            tool_calls = metadata.get('xml_tool_calls', [])
        else:
            tool_calls = []
        if tool_calls:
            tool_names = [tc.get('name', 'unknown') for tc in tool_calls]
            return f"[Used tools: {', '.join(tool_names)}]"
    
    # For tool messages, extract output
    if msg_type == 'tool':
        metadata = msg.get('metadata', {})
        if isinstance(metadata, dict):
            output = metadata.get('output', '')
        else:
            output = ''
        if output:
            try:
                output_obj = json.loads(output)
                return f"[Tool output: {str(output_obj)[:200]}]"
            except:
                return f"[Tool output: {str(output)[:200]}]"
    
    return str(content)[:500]

def reconstruct_conversation(messages):
    """Reconstruct a conversation from messages."""
    conversation = []
    
    for msg in messages:
        timestamp = msg.get('created_at', '')
        msg_type = msg.get('type', '')
        content = parse_message_content(msg)
        
        conversation.append({
            'timestamp': timestamp,
            'type': msg_type,
            'content': content,
            'message_id': msg.get('message_id', '')
        })
    
    return conversation

def extract_topics_and_activities(conversations):
    """Extract main topics and activities from conversations."""
    topics = defaultdict(int)
    activities = []
    
    for conv in conversations:
        for msg in conv['messages']:
            content = msg.get('content', '').lower()
            
            # Identify key topics
            if 'decode' in content or 'context' in content:
                topics['context_decoding'] += 1
            if 'python' in content or 'script' in content:
                topics['python_development'] += 1
            if 'file' in content or 'folder' in content:
                topics['file_management'] += 1
            if 'windows' in content:
                topics['windows_operations'] += 1
            if 'injection' in content or 'payload' in content:
                topics['context_injection'] += 1
            if 'github' in content or 'repo' in content:
                topics['github_operations'] += 1
            
            # Track activities
            if msg['type'] == 'user':
                activities.append({
                    'timestamp': msg['timestamp'],
                    'thread_id': conv['thread_id'],
                    'activity': content[:200]
                })
    
    return dict(topics), activities

def analyze_thread_timeline(conversations):
    """Create a timeline of thread activities."""
    timeline = []
    
    for conv in conversations:
        thread_id = conv['thread_id']
        messages = conv['messages']
        
        if messages:
            first_msg = messages[0]
            last_msg = messages[-1]
            
            timeline.append({
                'thread_id': thread_id,
                'start_time': first_msg['timestamp'],
                'end_time': last_msg['timestamp'],
                'duration': f"{len(messages)} messages",
                'first_query': first_msg.get('content', '')[:100],
                'message_count': len(messages)
            })
    
    # Sort by start time
    timeline.sort(key=lambda x: x['start_time'])
    
    return timeline

def main():
    upload_dir = Path('/home/ubuntu/upload')
    output_dir = Path('/home/ubuntu/agent_analysis')
    
    print("=" * 80)
    print("DEEP ANALYSIS - RECONSTRUCTING AGENT ACTIVITIES")
    print("=" * 80)
    print()
    
    # Load all message files
    message_files = sorted(upload_dir.glob('messages_*.json'))
    
    all_conversations = []
    
    for msg_file in message_files:
        print(f"Processing {msg_file.name}...")
        messages = load_json_file(msg_file)
        
        if messages:
            thread_id = messages[0].get('thread_id', 'unknown')
            conversation = reconstruct_conversation(messages)
            
            all_conversations.append({
                'thread_id': thread_id,
                'filename': msg_file.name,
                'messages': conversation
            })
    
    print()
    print("Extracting topics and activities...")
    topics, activities = extract_topics_and_activities(all_conversations)
    
    print()
    print("Creating timeline...")
    timeline = analyze_thread_timeline(all_conversations)
    
    # Generate detailed report
    report = {
        'conversations': all_conversations,
        'topics': topics,
        'activities': activities[:50],  # First 50 activities
        'timeline': timeline
    }
    
    # Save detailed report
    with open(output_dir / 'detailed_analysis.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, default=str)
    
    # Create human-readable summary
    with open(output_dir / 'summary.txt', 'w', encoding='utf-8') as f:
        f.write("=" * 80 + "\n")
        f.write("OFFICE AGENT BRAIN RECONSTRUCTION - SUMMARY\n")
        f.write("=" * 80 + "\n\n")
        
        f.write("OVERVIEW\n")
        f.write("-" * 80 + "\n")
        f.write(f"Total Threads: {len(all_conversations)}\n")
        f.write(f"Total Messages: {sum(len(c['messages']) for c in all_conversations)}\n")
        f.write("\n")
        
        f.write("MAIN TOPICS DISCUSSED\n")
        f.write("-" * 80 + "\n")
        for topic, count in sorted(topics.items(), key=lambda x: x[1], reverse=True):
            f.write(f"  {topic}: {count} mentions\n")
        f.write("\n")
        
        f.write("THREAD TIMELINE\n")
        f.write("-" * 80 + "\n")
        for t in timeline:
            f.write(f"\nThread: {t['thread_id']}\n")
            f.write(f"  Started: {t['start_time']}\n")
            f.write(f"  Ended: {t['end_time']}\n")
            f.write(f"  Messages: {t['message_count']}\n")
            f.write(f"  First Query: {t['first_query']}\n")
        f.write("\n")
        
        f.write("RECENT ACTIVITIES\n")
        f.write("-" * 80 + "\n")
        for activity in activities[-20:]:  # Last 20 activities
            f.write(f"\n{activity['timestamp']}\n")
            f.write(f"  Thread: {activity['thread_id']}\n")
            f.write(f"  Activity: {activity['activity']}\n")
    
    # Create conversation transcripts
    for conv in all_conversations:
        thread_id = conv['thread_id']
        transcript_file = output_dir / f"transcript_{thread_id}.txt"
        
        with open(transcript_file, 'w', encoding='utf-8') as f:
            f.write(f"CONVERSATION TRANSCRIPT\n")
            f.write(f"Thread ID: {thread_id}\n")
            f.write(f"File: {conv['filename']}\n")
            f.write("=" * 80 + "\n\n")
            
            for msg in conv['messages']:
                f.write(f"[{msg['timestamp']}] {msg['type'].upper()}\n")
                f.write(f"{msg['content']}\n")
                f.write("-" * 80 + "\n\n")
    
    print()
    print("=" * 80)
    print("DEEP ANALYSIS COMPLETE")
    print("=" * 80)
    print()
    print(f"Files created in {output_dir}:")
    print(f"  - detailed_analysis.json (full data)")
    print(f"  - summary.txt (human-readable summary)")
    print(f"  - transcript_*.txt (conversation transcripts)")
    print()
    print("KEY FINDINGS:")
    print("-" * 80)
    print(f"Total conversations: {len(all_conversations)}")
    print(f"Total messages: {sum(len(c['messages']) for c in all_conversations)}")
    print()
    print("Top topics:")
    for topic, count in sorted(topics.items(), key=lambda x: x[1], reverse=True)[:5]:
        print(f"  - {topic}: {count} mentions")
    print()

if __name__ == '__main__':
    main()
