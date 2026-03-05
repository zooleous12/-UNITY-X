#!/usr/bin/env python3.11
import base64
import gzip
import json

# Read the encoded payload
with open('/home/ubuntu/upload/pasted_content_4.txt', 'r') as f:
    content = f.read()

# Try to find the encoded part (skip any header text)
lines = content.strip().split('\n')
encoded_data = None

for line in lines:
    # Look for base85 or base64 encoded data (long strings with special chars)
    if len(line) > 100 and any(c in line for c in ['+', '/', '=', '~', '|', '^']):
        encoded_data = line
        break

if not encoded_data:
    # Maybe it's all one block
    encoded_data = ''.join(lines)

print("🔍 Attempting to decode Gemini's payload...")
print(f"Encoded data length: {len(encoded_data)} characters")

# Try base85 first
try:
    print("\n📦 Trying Base85 + GZIP + JSON...")
    decoded_b85 = base64.b85decode(encoded_data)
    decompressed = gzip.decompress(decoded_b85)
    json_data = json.loads(decompressed.decode('utf-8'))
    
    print("✅ SUCCESS! Decoded with Base85+GZIP+JSON")
    print("\n" + "="*70)
    print("GEMINI'S APPROACH:")
    print("="*70)
    print(json.dumps(json_data, indent=2))
    
    # Save to file
    with open('/home/ubuntu/gemini_decoded_payload.json', 'w') as f:
        json.dump(json_data, f, indent=2)
    
    print("\n✅ Saved to gemini_decoded_payload.json")
    
except Exception as e:
    print(f"❌ Base85 failed: {e}")
    
    # Try base64
    try:
        print("\n📦 Trying Base64 + GZIP + JSON...")
        decoded_b64 = base64.b64decode(encoded_data)
        decompressed = gzip.decompress(decoded_b64)
        json_data = json.loads(decompressed.decode('utf-8'))
        
        print("✅ SUCCESS! Decoded with Base64+GZIP+JSON")
        print("\n" + "="*70)
        print("GEMINI'S APPROACH:")
        print("="*70)
        print(json.dumps(json_data, indent=2))
        
        # Save to file
        with open('/home/ubuntu/gemini_decoded_payload.json', 'w') as f:
            json.dump(json_data, f, indent=2)
        
        print("\n✅ Saved to gemini_decoded_payload.json")
        
    except Exception as e2:
        print(f"❌ Base64 failed: {e2}")
        print("\n⚠️  Could not decode. The file might be corrupted or use a different encoding.")
