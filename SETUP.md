# Setup Instructions

## Backend Setup

1. **Install Python dependencies:**
```bash
pip install -r requirements-api.txt
```

2. **Start the Flask API server:**
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## Frontend Setup

1. **Open the website:**
   - Simply open `index.html` in your web browser, OR
   - Use a local server: `python -m http.server 8000` then visit `http://localhost:8000`

2. **Make sure the backend is running** before using the features.

## Features Available

The following features are fully functional:
- ✅ Password Security (Check, Generate, Validate)
- ✅ File Encryption (Encrypt/Decrypt Strings)
- ✅ Network Security (Port Check, SSL Check)
- ✅ Security Utilities (Hash, API Key Generation)
- ✅ Data Privacy (Detect Sensitive Data, Mask Email)
- ✅ Two-Factor Auth (Generate Secret, TOTP, Verify)
- ✅ URL Security (URL Analysis)
- ✅ Phishing Detection
- ✅ Email Security
- ✅ Security Headers
- ✅ Certificate Analyzer

## Troubleshooting

If features don't work:
1. Make sure the Flask backend is running (`python app.py`)
2. Check browser console for errors
3. Verify the API is accessible at `http://localhost:5000/api/health`
4. Make sure all Python modules from `cybersecurity-solutions` folder are accessible
