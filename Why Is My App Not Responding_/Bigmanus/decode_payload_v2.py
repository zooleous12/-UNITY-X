#!/usr/bin/env python3
"""Decode the context injection payload - trying multiple methods."""

import base64
import gzip
import json

def try_decode(payload_text):
    """Try different decoding methods."""
    
    # Remove the header
    if ':' in payload_text:
        header, body = payload_text.split(':', 1)
        print(f"Header: {header}")
        body = body.strip()
    else:
        body = payload_text.strip()
    
    print(f"Body length: {len(body)} characters")
    print(f"First 50 chars: {body[:50]}")
    
    # Try Method 1: Standard base64
    try:
        print("\n--- Trying standard base64 ---")
        compressed = base64.b64decode(body)
        print(f"Decoded to {len(compressed)} bytes")
        decompressed = gzip.decompress(compressed)
        json_text = decompressed.decode('utf-8')
        data = json.loads(json_text)
        print("✅ SUCCESS with standard base64!")
        return data
    except Exception as e:
        print(f"❌ Failed: {e}")
    
    # Try Method 2: Base85 (ascii85)
    try:
        print("\n--- Trying base85 (ascii85) ---")
        compressed = base64.a85decode(body, adobe=False)
        print(f"Decoded to {len(compressed)} bytes")
        decompressed = gzip.decompress(compressed)
        json_text = decompressed.decode('utf-8')
        data = json.loads(json_text)
        print("✅ SUCCESS with base85!")
        return data
    except Exception as e:
        print(f"❌ Failed: {e}")
    
    # Try Method 3: Base85 with adobe=True
    try:
        print("\n--- Trying base85 (adobe mode) ---")
        compressed = base64.a85decode(body, adobe=True)
        print(f"Decoded to {len(compressed)} bytes")
        decompressed = gzip.decompress(compressed)
        json_text = decompressed.decode('utf-8')
        data = json.loads(json_text)
        print("✅ SUCCESS with base85 (adobe)!")
        return data
    except Exception as e:
        print(f"❌ Failed: {e}")
    
    # Try Method 4: base64 without gzip
    try:
        print("\n--- Trying base64 without gzip ---")
        decoded = base64.b64decode(body)
        json_text = decoded.decode('utf-8')
        data = json.loads(json_text)
        print("✅ SUCCESS with base64 (no gzip)!")
        return data
    except Exception as e:
        print(f"❌ Failed: {e}")
    
    print("\n❌ All decoding methods failed!")
    return None

# Read the payload
with open('/home/ubuntu/context_injection_payload.txt', 'r') as f:
    payload = f.read()

# Try to decode it
decoded_data = try_decode(payload)

if decoded_data:
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
            if value:
                print(f"  Sub-keys: {list(value.keys())[:5]}")
        elif isinstance(value, list):
            print(f"\n{key}: {len(value)} items")
        else:
            print(f"\n{key}: {str(value)[:200]}")
    
    print("\n" + "="*80)
    print("Full decoded data saved to: /home/ubuntu/decoded_context.json")
    print("="*80)
else:
    print("\nFailed to decode payload!")
