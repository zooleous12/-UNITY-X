#!/usr/bin/env python3
"""
Analyze and reconstruct the office agent's "brains" from exported JSON files.
"""

import json
import os
from datetime import datetime
from collections import defaultdict, Counter
from pathlib import Path

def load_json_file(filepath):
    """Load a JSON file and return its contents."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None

def analyze_metadata(metadata):
    """Analyze the metadata file to understand threads and structure."""
    if not metadata:
        return None
    
    analysis = {
        'threads': [],
        'total_messages': 0,
        'message_types': Counter(),
        'date_range': {'earliest': None, 'latest': None},
        'projects': set(),
        'thread_details': {}
    }
    
    # Extract thread information
    if 'export_personal_data' in metadata[0]:
        threads = metadata[0]['export_personal_data'].get('threads', [])
        messages = metadata[0]['export_personal_data'].get('messages', [])
        
        # Analyze threads
        for thread in threads:
            thread_info = {
                'thread_id': thread.get('thread_id'),
                'name': thread.get('name', 'Unknown'),
                'created_at': thread.get('created_at'),
                'updated_at': thread.get('updated_at'),
                'is_public': thread.get('is_public'),
                'project_id': thread.get('project_id'),
                'description': thread.get('description', '')
            }
            analysis['threads'].append(thread_info)
            analysis['projects'].add(thread.get('project_id'))
            analysis['thread_details'][thread.get('thread_id')] = thread_info
        
        # Analyze messages
        analysis['total_messages'] = len(messages)
        
        for msg in messages:
            msg_type = msg.get('type', 'unknown')
            analysis['message_types'][msg_type] += 1
            
            # Track date range
            created_at = msg.get('created_at')
            if created_at:
                if not analysis['date_range']['earliest'] or created_at < analysis['date_range']['earliest']:
                    analysis['date_range']['earliest'] = created_at
                if not analysis['date_range']['latest'] or created_at > analysis['date_range']['latest']:
                    analysis['date_range']['latest'] = created_at
    
    return analysis

def analyze_message_file(filepath):
    """Analyze a message file to extract conversation details."""
    messages = load_json_file(filepath)
    if not messages:
        return None
    
    analysis = {
        'filename': os.path.basename(filepath),
        'message_count': len(messages),
        'message_types': Counter(),
        'roles': Counter(),
        'conversation_flow': [],
        'date_range': {'earliest': None, 'latest': None},
        'has_encrypted_content': False,
        'thread_id': None
    }
    
    for msg in messages:
        msg_type = msg.get('type', 'unknown')
        analysis['message_types'][msg_type] += 1
        
        # Get thread_id
        if not analysis['thread_id'] and 'thread_id' in msg:
            analysis['thread_id'] = msg['thread_id']
        
        # Track conversation flow
        content = msg.get('content', '')
        created_at = msg.get('created_at', '')
        
        # Check for encrypted content
        if '$$k1764536827_93c5375f$' in str(content):
            analysis['has_encrypted_content'] = True
        
        flow_item = {
            'type': msg_type,
            'timestamp': created_at,
            'has_content': bool(content),
            'content_length': len(str(content))
        }
        
        # Try to extract readable content from user messages
        if msg_type == 'user':
            try:
                if isinstance(content, str) and content.startswith('{'):
                    content_obj = json.loads(content)
                    if 'content' in content_obj:
                        flow_item['preview'] = str(content_obj['content'])[:100]
            except:
                pass
        
        analysis['conversation_flow'].append(flow_item)
        
        # Track date range
        if created_at:
            if not analysis['date_range']['earliest'] or created_at < analysis['date_range']['earliest']:
                analysis['date_range']['earliest'] = created_at
            if not analysis['date_range']['latest'] or created_at > analysis['date_range']['latest']:
                analysis['date_range']['latest'] = created_at
    
    return analysis

def extract_user_queries(messages):
    """Extract user queries from message files."""
    queries = []
    
    for msg in messages:
        if msg.get('type') == 'user':
            content = msg.get('content', '')
            created_at = msg.get('created_at', '')
            
            # Try to parse content
            try:
                if isinstance(content, str) and content.startswith('{'):
                    content_obj = json.loads(content)
                    if 'content' in content_obj:
                        queries.append({
                            'timestamp': created_at,
                            'query': content_obj['content']
                        })
                else:
                    queries.append({
                        'timestamp': created_at,
                        'query': content
                    })
            except:
                queries.append({
                    'timestamp': created_at,
                    'query': content[:200]  # First 200 chars
                })
    
    return queries

def main():
    upload_dir = Path('/home/ubuntu/upload')
    output_dir = Path('/home/ubuntu/agent_analysis')
    output_dir.mkdir(exist_ok=True)
    
    print("=" * 80)
    print("OFFICE AGENT BRAIN RECONSTRUCTION")
    print("=" * 80)
    print()
    
    # Load and analyze metadata
    print("Loading metadata...")
    metadata = load_json_file(upload_dir / 'metadata_ab78a280-f162-4f56-a47e-6164b2ae139e.json')
    metadata_analysis = analyze_metadata(metadata)
    
    # Analyze all message files
    message_files = sorted(upload_dir.glob('messages_*.json'))
    message_analyses = []
    
    print(f"Found {len(message_files)} message files")
    print()
    
    for msg_file in message_files:
        print(f"Analyzing {msg_file.name}...")
        analysis = analyze_message_file(msg_file)
        if analysis:
            message_analyses.append(analysis)
            
            # Extract user queries
            messages = load_json_file(msg_file)
            if messages:
                queries = extract_user_queries(messages)
                analysis['user_queries'] = queries
    
    # Generate comprehensive report
    report = {
        'metadata_analysis': metadata_analysis,
        'message_file_analyses': message_analyses,
        'summary': {
            'total_threads': len(metadata_analysis['threads']) if metadata_analysis else 0,
            'total_projects': len(metadata_analysis['projects']) if metadata_analysis else 0,
            'total_message_files': len(message_analyses),
            'total_messages_in_files': sum(a['message_count'] for a in message_analyses),
            'encrypted_files': sum(1 for a in message_analyses if a['has_encrypted_content'])
        }
    }
    
    # Save full analysis
    with open(output_dir / 'full_analysis.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, default=str)
    
    print()
    print("=" * 80)
    print("ANALYSIS COMPLETE")
    print("=" * 80)
    print()
    print(f"Total threads: {report['summary']['total_threads']}")
    print(f"Total projects: {report['summary']['total_projects']}")
    print(f"Total message files: {report['summary']['total_message_files']}")
    print(f"Total messages: {report['summary']['total_messages_in_files']}")
    print(f"Files with encrypted content: {report['summary']['encrypted_files']}")
    print()
    
    # Print thread details
    if metadata_analysis and metadata_analysis['threads']:
        print("THREADS:")
        print("-" * 80)
        for thread in metadata_analysis['threads']:
            print(f"  Thread ID: {thread['thread_id']}")
            print(f"  Created: {thread['created_at']}")
            print(f"  Updated: {thread['updated_at']}")
            print(f"  Public: {thread['is_public']}")
            print()
    
    # Print message file summaries
    print("MESSAGE FILES:")
    print("-" * 80)
    for analysis in message_analyses:
        print(f"  File: {analysis['filename']}")
        print(f"  Thread ID: {analysis['thread_id']}")
        print(f"  Messages: {analysis['message_count']}")
        print(f"  Types: {dict(analysis['message_types'])}")
        print(f"  Date Range: {analysis['date_range']['earliest']} to {analysis['date_range']['latest']}")
        print(f"  Encrypted: {analysis['has_encrypted_content']}")
        
        # Show first few user queries
        if 'user_queries' in analysis and analysis['user_queries']:
            print(f"  User Queries ({len(analysis['user_queries'])} total):")
            for query in analysis['user_queries'][:3]:
                preview = query['query'][:100]
                print(f"    - {query['timestamp']}: {preview}")
        print()
    
    print(f"Full analysis saved to: {output_dir / 'full_analysis.json'}")
    
    return report

if __name__ == '__main__':
    main()
