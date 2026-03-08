#!/usr/bin/env python3
"""Decode the context injection payload."""

import base64
import gzip
import json

def decode_payload(payload_text):
    """Decode B64+GZIP+JSON payload."""
    # Remove the header
    if ':' in payload_text:
        header, body = payload_text.split(':', 1)
        print(f"Header: {header}")
    else:
        body = payload_text
    
    # Decode base64
    compressed = base64.b64decode(body.strip())
    
    # Decompress gzip
    decompressed = gzip.decompress(compressed)
    
    # Decode UTF-8
    json_text = decompressed.decode('utf-8')
    
    # Parse JSON
    data = json.loads(json_text)
    
    return data

# Read the payload
with open('/home/ubuntu/context_injection_payload.txt', 'r') as f:
    payload = f.read().strip()

# Decode it
decoded_data = decode_payload(payload)

# Save to JSON
with open('/home/ubuntu/decoded_context.json', 'w') as f:
    json.dump(decoded_data, f, indent=2)

# Print summary
print("\n" + "="*80)
print("CONTEXT INJECTION PAYLOAD DECODED")
print("="*80)
print(f"\nKeys in decoded data: {list(decoded_data.keys())}")
print(f"\nTotal size: {len(json.dumps(decoded_data))} characters")

# Print first level structure
for key, value in decoded_data.items():
    if isinstance(value, dict):
        print(f"\n{key}: {len(value)} items")
        print(f"  Sub-keys: {list(value.keys())[:5]}...")
    elif isinstance(value, list):
        print(f"\n{key}: {len(value)} items")
    else:
        print(f"\n{key}: {str(value)[:100]}...")

print("\n" + "="*80)
print("Full decoded data saved to: /home/ubuntu/decoded_context.json")
print("="*80)
