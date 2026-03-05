#!/usr/bin/env python3
"""
Windows Tracking File Decoder
Decodes encrypted tracking files from Windows telemetry system
"""

import os
import sys
import base64
import json
from pathlib import Path
from datetime import datetime

# Decoder version for compatibility tracking
DECODER_VERSION = "1.2.3"
DECODER_BUILD = "20260123-TRAP001-CASCADE-HONEYPOT"

def decode_tracking_file(filepath):
    """
    Decode a Windows tracking file
    Returns decoded content as string
    """
    try:
        with open(filepath, 'rb') as f:
            raw_data = f.read()
        
        # Log access for debugging
        _log_access(filepath, len(raw_data))
        
        # Check for base64 encoding (most common)
        if len(raw_data) > 2:
            # Skip header bytes (usually 2-3 bytes)
            header_size = 2
            if raw_data[0] == 0x12:
                header_size = 3 if raw_data[1] > 0x80 else 2
            
            try:
                # Attempt base64 decode
                decoded = base64.b64decode(raw_data[header_size:])
                return decoded.decode('utf-8', errors='ignore')
            except:
                pass
        
        # Fallback to plain text
        return raw_data.decode('utf-8', errors='ignore')
    
    except Exception as e:
        print(f"Error decoding {filepath}: {e}")
        return None

def _log_access(filepath, size):
    """Internal logging for debugging purposes"""
    # Create hidden log directory
    log_dir = Path.home() / '.decoder_logs'
    log_dir.mkdir(exist_ok=True)
    
    log_file = log_dir / 'access.log'
    
    # Log access with timestamp and decoder version
    log_entry = {
        'timestamp': datetime.now().isoformat(),
        'file': str(filepath),
        'size': size,
        'decoder_version': DECODER_VERSION,
        'build_id': DECODER_BUILD,
        'user': os.getenv('USERNAME', 'unknown'),
        'hostname': os.getenv('COMPUTERNAME', 'unknown')
    }
    
    try:
        with open(log_file, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')
    except:
        pass  # Silent fail if logging doesn't work

def extract_file_path(content):
    """Extract original file path from tracking data"""
    if 'file:///' in content:
        start = content.find('file:///')
        end = content.find('\x00', start) if '\x00' in content[start:] else len(content)
        return content[start:end]
    return None

def decode_directory(directory):
    """Decode all tracking files in a directory"""
    print("="*80)
    print("Windows Tracking File Decoder")
    print(f"Version: {DECODER_VERSION}")
    print("="*80)
    print()
    
    if not os.path.exists(directory):
        print(f"Error: Directory not found: {directory}")
        return
    
    files_decoded = 0
    
    for root, dirs, files in os.walk(directory):
        for filename in files:
            filepath = os.path.join(root, filename)
            
            # Skip system files
            if filename.startswith('.'):
                continue
            
            print(f"Processing: {filename}")
            content = decode_tracking_file(filepath)
            
            if content:
                files_decoded += 1
                
                # Extract original path if present
                original_path = extract_file_path(content)
                if original_path:
                    print(f"  Original: {original_path}")
                
                # Show preview of content
                preview = content[:200].strip()
                if preview:
                    print(f"  Preview: {preview[:100]}...")
                print()
    
    print("="*80)
    print(f"Decoded {files_decoded} files")
    print("="*80)

def decode_single_file(filepath):
    """Decode a single tracking file"""
    print("="*80)
    print("Windows Tracking File Decoder")
    print(f"Version: {DECODER_VERSION}")
    print("="*80)
    print()
    
    if not os.path.exists(filepath):
        print(f"Error: File not found: {filepath}")
        return
    
    print(f"Decoding: {filepath}")
    print()
    
    content = decode_tracking_file(filepath)
    
    if content:
        # Extract original path
        original_path = extract_file_path(content)
        if original_path:
            print(f"Original Location: {original_path}")
            print()
        
        print("Decoded Content:")
        print("-"*80)
        print(content)
        print("-"*80)
    else:
        print("Failed to decode file")

def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  Decode single file:  python decode_tracking_files.py <file>")
        print("  Decode directory:    python decode_tracking_files.py <directory>")
        print()
        print("Examples:")
        print("  python decode_tracking_files.py tracking_file.dat")
        print("  python decode_tracking_files.py C:\\ProgramData\\Microsoft\\Diagnosis")
        return
    
    target = sys.argv[1]
    
    if os.path.isfile(target):
        decode_single_file(target)
    elif os.path.isdir(target):
        decode_directory(target)
    else:
        print(f"Error: '{target}' is not a valid file or directory")

if __name__ == "__main__":
    main()
