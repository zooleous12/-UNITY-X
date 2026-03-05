# AI Context Orchestrator [AI-ORCHESTRATOR]
*PROPERTY OF CHARLES KENDRICK 12/9/25*

A sophisticated tool for encoding and decoding context data using multiple compression strategies, designed for AI workflow optimization and cross-platform data injection.

## 🚀 Features

- **Multiple Encoding Strategies**: Base64, Base64+GZIP, Base85+GZIP
- **Automatic Optimization**: Selects smallest payload automatically
- **PNG Embedding**: Embed data in PNG text chunks for steganography
- **Placeholder Substitution**: Dynamic content replacement
- **Robust JSON Extraction**: Handles mixed-content files
- **Cross-Platform**: Works on Windows, Linux, and macOS

## 📦 Installation

1. **Clone or download** this repository
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## 🔧 Usage

### Command Line Interface

```bash
# Show help
python cli.py --help

# Run full test cycle
python cli.py test

# Encode data from default source
python cli.py encode

# Encode from specific file
python cli.py encode -s mydata.json

# Decode existing data
python cli.py decode

# Show system information
python cli.py info
```

### Direct Script Usage

```bash
# Encode context data
python encode_context.py

# Decode context data
python decode_context.py
```

## 📁 File Structure

```
ai-orchestrator/
├── encode_context.py          # Main encoding engine
├── decode_context.py          # Main decoding engine
├── cli.py                     # Command-line interface
├── requirements.txt           # Python dependencies
├── README.md                  # This file
├── Whisper_Deck/             # Output directory
│   ├── Context_MasterInjection.base64    # Encoded data
│   ├── Context_MasterInjection.png       # PNG with embedded data
│   └── Context_MasterInjection.decoded.json  # Decoded output
└── tmpDFF8.tmp.py            # Example source file
```

## 🔄 Encoding Process

1. **Source Detection**: Automatically finds JSON data in various file locations
2. **JSON Extraction**: Extracts JSON from mixed-content files
3. **Placeholder Substitution**: Replaces variables like `${USER_NAME}`
4. **Multi-Strategy Encoding**: Creates multiple compressed variants
5. **Optimization**: Selects smallest payload automatically
6. **Output Generation**: Creates both base64 file and PNG embedding

## 📊 Encoding Strategies
| Strategy | Compression | Overhead | Use Case |
|----------|-------------|----------|----------|
| **B64+JSON** | None | ~33% | Simple data transfer |
| **B64+GZIP+JSON** | High | ~33% | Large data with compression |
| **B85+GZIP+JSON** | High | ~25% | **Maximum efficiency** |

## 🛠️ Configuration

### Environment Variables

- `CONTEXT_SOURCE_PATH`: Override default source file path

### Default Placeholders

```python
DEFAULT_PLACEHOLDERS = {
    "${USER_NAME}": "Charles Kendrick",
    "${USER_LOCATION}": "Maricopa, AZ",
}
```

### Encoding Options

```python
ENABLE_GZIP = True              # Enable GZIP compression
AUTO_SELECT_SMALLEST = True     # Auto-select optimal encoding
IMAGE_EMBED_MODE = "auto"       # PNG embedding mode: 'auto'|'json'|'envelope'
```

## 🔍 Example Usage

### 1. Create Source Data

Create a file `mydata.json`:
```json
{
  "user_profile": {
    "name": "${USER_NAME}",
    "location": "${USER_LOCATION}",
    "background": ["Developer", "AI Enthusiast"]
  },
  "project": {
    "name": "AI Orchestrator",
    "status": "active"
  }
}
```

### 2. Encode the Data

```bash
python cli.py encode -s mydata.json
```

**Output:**
```
🔄 Encoding context data...
[+] Source:
 - mydata.json
[+] Master injection written:
 - Whisper_Deck/Context_MasterInjection.base64 [B85+GZIP+JSON, 245 chars]
[+] PNG written: Whisper_Deck/Context_MasterInjection.png (387 bytes)
✅ Encoding completed successfully!
```

### 3. Decode the Data

```bash
python cli.py decode
```

**Output:**
```
🔄 Decoding context data...
[+] Decoded JSON written:
 - Whisper_Deck/Context_MasterInjection.decoded.json
[+] Source:
 - Whisper_Deck/Context_MasterInjection.base64
✅ Decoding completed successfully!
```

## 🔒 Security Considerations


- **Data Compression**: Reduces payload size but may reveal patterns
- **Steganography**: PNG embedding provides covert data transport
- **Placeholder Security**: Avoid sensitive data in placeholders
- **File Permissions**: Secure output directory appropriately

## 🧪 Testing

Run the built-in test cycle:

```bash
python cli.py test
```

This creates test data, encodes it, decodes it, and verifies the complete cycle.

## 📈 Performance

**Compression Ratios** (typical):
- JSON → B64+JSON: ~133% of original
- JSON → B64+GZIP+JSON: ~40-60% of original  
- JSON → B85+GZIP+JSON: ~30-50% of original

**File Sizes** (example):
- Original JSON: 742 bytes
- B85+GZIP+JSON: 528 bytes (29% reduction)
- PNG embedding: 492 bytes (34% reduction)

## 🔧 Advanced Usage

### Custom Source File Locations

The encoder searches for source files in this order:
1. `CONTEXT_SOURCE_PATH` environment variable
2. `./tmpDFF8.tmp.py` (repo-local)
3. `~/AppData/Local/Temp/t2csmjpi..py` (Windows temp)
4. `~/AppData/Local/Temp/tmpDFF8.tmp.py` (fallback temp)

### PNG Text Chunk Embedding

The tool can embed data in PNG text chunks:
- **'injection' chunk**: Contains encoded envelope data
- **'context' chunk**: Contains raw JSON data
- **Auto mode**: Selects smallest resulting PNG file

### JSON Extraction from Mixed Files

The tool can extract JSON from files containing other content by:
- Finding the first `{` character
- Matching braces while respecting string escapes
- Extracting the complete root JSON object

## 🤝 Contributing

This tool is part of a larger AI orchestration project. Key areas for enhancement:
- Additional compression algorithms
- More steganography methods
- GUI interface
- Cloud storage integration
- Enhanced security features

## 📄 License

This project is part of Charles Kendrick's AI orchestration research and development.

## 🔗 Related Projects

- **Gemini Integration**: Cross-platform AI orchestration
- **Copilot Bridging**: Memory and context injection
- **Dashboard Systems**: OneNote/Excel integration
- **Security Tools**: Privacy-aware workflow optimization