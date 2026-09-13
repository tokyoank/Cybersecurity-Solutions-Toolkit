"""
Flask Backend API for Cybersecurity Solutions Toolkit
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add the cybersecurity-solutions folder to path
sys.path.insert(0, r'C:\Users\ankit\cybersecurity-solutions')

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Import security modules
try:
    from password_security import PasswordSecurity
    from file_encryption import FileEncryption
    from network_security import NetworkSecurity
    from security_utilities import SecurityUtilities
    from data_privacy import DataPrivacy
    from two_factor_auth import TwoFactorAuth
    from secure_deletion import SecureDeletion
    from url_security import URLSecurity
    from email_security import EmailSecurity
    from security_headers import SecurityHeaders
    from security_audit import SecurityAudit
    from certificate_analyzer import CertificateAnalyzer
    from backup_verification import BackupVerification
    from config_security import ConfigSecurity
    from phishing_detector import PhishingDetector
    from intrusion_detection import IntrusionDetectionSystem
    from malware_detector_ml import MalwareDetectorML
    from email_spam_phishing import EmailSpamPhishingDetector
    from keylogger_detector import KeyloggerDetector
    from blockchain_voting import BlockchainVotingSystem
    from evil_twin_detector import EvilTwinDetector
    
    # Initialize instances
    password_security = PasswordSecurity()
    file_encryption = FileEncryption()
    network_security = NetworkSecurity()
    security_utilities = SecurityUtilities()
    data_privacy = DataPrivacy()
    two_factor_auth = TwoFactorAuth()
    secure_deletion = SecureDeletion()
    url_security = URLSecurity()
    email_security = EmailSecurity()
    security_headers = SecurityHeaders()
    security_audit = SecurityAudit()
    certificate_analyzer = CertificateAnalyzer()
    backup_verification = BackupVerification()
    config_security = ConfigSecurity()
    phishing_detector = PhishingDetector()
    ids = IntrusionDetectionSystem()
    malware_detector = MalwareDetectorML()
    email_spam_detector = EmailSpamPhishingDetector()
    keylogger_detector = KeyloggerDetector()
    voting_system = BlockchainVotingSystem()
    evil_twin_detector = EvilTwinDetector()
    
    MODULES_LOADED = True
    print("✓ All security modules loaded successfully")
except ImportError as e:
    print(f"Warning: Could not import some modules: {e}")
    print("Some features may not be available")
    MODULES_LOADED = False
except Exception as e:
    print(f"Warning: Error loading modules: {e}")
    MODULES_LOADED = False

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'modules_loaded': MODULES_LOADED})

# Password Security Endpoints
@app.route('/api/password/check', methods=['POST'])
def check_password():
    try:
        data = request.json
        password = data.get('password', '')
        score, strength, feedback = password_security.check_strength(password)
        return jsonify({
            'success': True,
            'score': score,
            'strength': strength,
            'feedback': feedback
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/password/generate', methods=['POST'])
def generate_password():
    try:
        data = request.json
        length = data.get('length', 16)
        password = password_security.generate_password(length=length)
        return jsonify({'success': True, 'password': password})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/password/validate', methods=['POST'])
def validate_password():
    try:
        data = request.json
        password = data.get('password', '')
        is_valid = password_security.validate_password(password)
        return jsonify({'success': True, 'valid': is_valid})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# File Encryption Endpoints
@app.route('/api/encryption/encrypt-string', methods=['POST'])
def encrypt_string():
    try:
        data = request.json
        text = data.get('text', '')
        password = data.get('password', '')
        encrypted = file_encryption.encrypt_string(text, password)
        return jsonify({'success': True, 'encrypted': encrypted})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/encryption/decrypt-string', methods=['POST'])
def decrypt_string():
    try:
        data = request.json
        encrypted = data.get('encrypted', '')
        password = data.get('password', '')
        decrypted = file_encryption.decrypt_string(encrypted, password)
        return jsonify({'success': True, 'decrypted': decrypted})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# Network Security Endpoints
@app.route('/api/network/check-port', methods=['POST'])
def check_port():
    try:
        data = request.json
        host = data.get('host', '')
        port = data.get('port', 80)
        is_open, status = network_security.check_port(host, port)
        return jsonify({'success': True, 'is_open': is_open, 'status': status})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/network/check-ssl', methods=['POST'])
def check_ssl():
    try:
        data = request.json
        url = data.get('url', '')
        result = network_security.check_website_ssl(url)
        return jsonify({'success': True, 'result': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# Security Utilities Endpoints
@app.route('/api/utilities/hash', methods=['POST'])
def hash_string():
    try:
        data = request.json
        text = data.get('text', '')
        algorithm = data.get('algorithm', 'sha256')
        hash_value = security_utilities.hash_string(text, algorithm)
        return jsonify({'success': True, 'hash': hash_value})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/utilities/generate-api-key', methods=['POST'])
def generate_api_key():
    try:
        data = request.json
        length = data.get('length', 32)
        key = security_utilities.generate_api_key(length)
        return jsonify({'success': True, 'key': key})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# Data Privacy Endpoints
@app.route('/api/privacy/detect', methods=['POST'])
def detect_sensitive_data():
    try:
        data = request.json
        text = data.get('text', '')
        detected = data_privacy.detect_sensitive_data(text)
        return jsonify({'success': True, 'detected': detected})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/privacy/mask-email', methods=['POST'])
def mask_email():
    try:
        data = request.json
        email = data.get('email', '')
        masked = data_privacy.mask_email(email)
        return jsonify({'success': True, 'masked': masked})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# Two-Factor Auth Endpoints
@app.route('/api/2fa/generate-secret', methods=['POST'])
def generate_secret():
    try:
        data = request.json
        length = data.get('length', 32)
        secret = two_factor_auth.generate_secret_key(length)
        return jsonify({'success': True, 'secret': secret})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/2fa/generate-totp', methods=['POST'])
def generate_totp():
    try:
        data = request.json
        secret = data.get('secret', '')
        code = two_factor_auth.generate_totp(secret)
        remaining = two_factor_auth.get_remaining_time()
        return jsonify({'success': True, 'code': code, 'remaining': remaining})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/2fa/verify', methods=['POST'])
def verify_totp():
    try:
        data = request.json
        secret = data.get('secret', '')
        code = data.get('code', '')
        is_valid = two_factor_auth.verify_totp(secret, code)
        return jsonify({'success': True, 'valid': is_valid})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# URL Security Endpoints
@app.route('/api/url/analyze', methods=['POST'])
def analyze_url():
    try:
        data = request.json
        url = data.get('url', '')
        result = url_security.analyze_url(url)
        return jsonify({'success': True, 'result': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# Phishing Detection Endpoints
@app.route('/api/phishing/detect', methods=['POST'])
def detect_phishing():
    try:
        data = request.json
        url = data.get('url', '')
        deep = data.get('deep', True)
        result = phishing_detector.detect_phishing(url, deep_analysis=deep)
        return jsonify({'success': True, 'result': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# Email Security Endpoints
@app.route('/api/email/analyze', methods=['POST'])
def analyze_email():
    try:
        data = request.json
        email_content = data.get('email_content', '')
        result = email_security.analyze_full_email(email_content)
        return jsonify({'success': True, 'result': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# Security Headers Endpoints
@app.route('/api/headers/check', methods=['POST'])
def check_headers():
    try:
        data = request.json
        url = data.get('url', '')
        result = security_headers.check_security_headers(url)
        return jsonify({'success': True, 'result': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# Certificate Analyzer Endpoints
@app.route('/api/certificate/analyze', methods=['POST'])
def analyze_certificate():
    try:
        data = request.json
        hostname = data.get('hostname', '')
        port = data.get('port', 443)
        result = certificate_analyzer.analyze_certificate(hostname, port)
        return jsonify({'success': True, 'result': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# Malware Detection Endpoints
@app.route('/api/malware/detect', methods=['POST'])
def detect_malware():
    try:
        data = request.json
        file_path = data.get('file_path', '')
        use_ml = data.get('use_ml', True)
        result = malware_detector.detect_malware(file_path, use_ml=use_ml)
        return jsonify({'success': True, 'result': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    print("Starting Cybersecurity Solutions API Server...")
    print("API will be available at http://localhost:5000")
    app.run(debug=True, port=5000)
