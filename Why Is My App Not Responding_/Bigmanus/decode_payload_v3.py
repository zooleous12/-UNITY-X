#!/usr/bin/env python3
"""Decode with detailed diagnostics."""

import base64
import gzip
import zlib

# Read and clean the payload
with open('/home/ubuntu/context_injection_payload.txt', 'r') as f:
    payload = f.read()

# Remove header and clean
if ':' in payload:
    header, body = payload.split(':', 1)
else:
    body = payload

# Remove all whitespace
body = body.replace('\n', '').replace('\r', '').replace(' ', '').strip()

print(f"Cleaned body length: {len(body)}")
print(f"First 100 chars: {body[:100]}")
print(f"Last 100 chars: {body[-100:]}")

# Decode base64
try:
    compressed = base64.b64decode(body)
    print(f"\n✅ Base64 decoded successfully: {len(compressed)} bytes")
    
    # Check gzip header
    if len(compressed) >= 2:
        print(f"First 2 bytes (gzip magic): {compressed[0]:02x} {compressed[1]:02x}")
        if compressed[0] == 0x1f and compressed[1] == 0x8b:
            print("✅ Valid gzip header detected")
        else:
            print("❌ Invalid gzip header!")
    
    # Try to decompress with more details
    try:
        decompressed = gzip.decompress(compressed)
        print(f"✅ Gzip decompressed: {len(decompressed)} bytes")
        
        # Try to decode as UTF-8
        text = decompressed.decode('utf-8')
        print(f"✅ UTF-8 decoded: {len(text)} characters")
        print(f"\nFirst 200 characters:")
        print(text[:200])
        
        # Save it
        with open('/home/ubuntu/decoded_context.json', 'w') as f:
            f.write(text)
        print("\n✅ Saved to decoded_context.json")
        
    except zlib.error as e:
        print(f"\n❌ Gzip decompression failed: {e}")
        print(f"Compressed data length: {len(compressed)}")
        print(f"First 20 bytes: {compressed[:20].hex()}")
        print(f"Last 20 bytes: {compressed[-20:].hex()}")
        
        # Try raw zlib
        print("\nTrying raw zlib decompression...")
        try:
            decompressed = zlib.decompress(compressed)
            print(f"✅ Raw zlib worked: {len(decompressed)} bytes")
        except Exception as e2:
            print(f"❌ Raw zlib also failed: {e2}")
            
except Exception as e:
    print(f"❌ Base64 decode failed: {e}")
