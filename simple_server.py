"""
Simple HTTP Server for Cybersecurity Solutions
Works without Flask - uses Python's built-in http.server
Supports ALL 21 security features
"""
import http.server
import socketserver
import json
import sys
import os
from urllib.parse import urlparse, parse_qs

# Add the cybersecurity-solutions folder to path
sys.path.insert(0, r'C:\Users\ankit\cybersecurity-solutions')

PORT = 5000

# Try to import ALL security modules
modules = {}
MODULES_LOADED = True

try:
    from password_security import PasswordSecurity
    modules['password'] = PasswordSecurity()
    print("✓ Password Security loaded")
except Exception as e:
    print(f"✗ Password Security: {e}")

try:
    from file_encryption import FileEncryption
    modules['encryption'] = FileEncryption()
    print("✓ File Encryption loaded")
except Exception as e:
    print(f"✗ File Encryption: {e}")

try:
    from network_security import NetworkSecurity
    modules['network'] = NetworkSecurity()
    print("✓ Network Security loaded")
except Exception as e:
    print(f"✗ Network Security: {e}")

try:
    from security_utilities import SecurityUtilities
    modules['utilities'] = SecurityUtilities()
    print("✓ Security Utilities loaded")
except Exception as e:
    print(f"✗ Security Utilities: {e}")

try:
    from data_privacy import DataPrivacy
    modules['privacy'] = DataPrivacy()
    print("✓ Data Privacy loaded")
except Exception as e:
    print(f"✗ Data Privacy: {e}")

try:
    from two_factor_auth import TwoFactorAuth
    modules['2fa'] = TwoFactorAuth()
    print("✓ Two-Factor Auth loaded")
except Exception as e:
    print(f"✗ Two-Factor Auth: {e}")

try:
    from secure_deletion import SecureDeletion
    modules['deletion'] = SecureDeletion()
    print("✓ Secure Deletion loaded")
except Exception as e:
    print(f"✗ Secure Deletion: {e}")

try:
    from url_security import URLSecurity
    modules['url'] = URLSecurity()
    print("✓ URL Security loaded")
except Exception as e:
    print(f"✗ URL Security: {e}")

try:
    from email_security import EmailSecurity
    modules['email'] = EmailSecurity()
    print("✓ Email Security loaded")
except Exception as e:
    print(f"✗ Email Security: {e}")

try:
    from security_headers import SecurityHeaders
    modules['headers'] = SecurityHeaders()
    print("✓ Security Headers loaded")
except Exception as e:
    print(f"✗ Security Headers: {e}")

try:
    from security_audit import SecurityAudit
    modules['audit'] = SecurityAudit()
    print("✓ Security Audit loaded")
except Exception as e:
    print(f"✗ Security Audit: {e}")

try:
    from certificate_analyzer import CertificateAnalyzer
    modules['certificate'] = CertificateAnalyzer()
    print("✓ Certificate Analyzer loaded")
except Exception as e:
    print(f"✗ Certificate Analyzer: {e}")

try:
    from backup_verification import BackupVerification
    modules['backup'] = BackupVerification()
    print("✓ Backup Verification loaded")
except Exception as e:
    print(f"✗ Backup Verification: {e}")

try:
    from config_security import ConfigSecurity
    modules['config'] = ConfigSecurity()
    print("✓ Config Security loaded")
except Exception as e:
    print(f"✗ Config Security: {e}")

try:
    from phishing_detector import PhishingDetector
    modules['phishing'] = PhishingDetector()
    print("✓ Phishing Detector loaded")
except Exception as e:
    print(f"✗ Phishing Detector: {e}")

try:
    from intrusion_detection import IntrusionDetectionSystem
    modules['ids'] = IntrusionDetectionSystem()
    print("✓ Intrusion Detection loaded")
except Exception as e:
    print(f"✗ Intrusion Detection: {e}")

try:
    from malware_detector_ml import MalwareDetectorML
    modules['malware'] = MalwareDetectorML()
    print("✓ Malware Detection loaded")
except Exception as e:
    print(f"✗ Malware Detection: {e}")

try:
    from email_spam_phishing import EmailSpamPhishingDetector
    modules['email_spam'] = EmailSpamPhishingDetector()
    print("✓ Email Spam Detection loaded")
except Exception as e:
    print(f"✗ Email Spam Detection: {e}")

try:
    from keylogger_detector import KeyloggerDetector
    modules['keylogger'] = KeyloggerDetector()
    print("✓ Keylogger Detection loaded")
except Exception as e:
    print(f"✗ Keylogger Detection: {e}")

try:
    from blockchain_voting import BlockchainVotingSystem
    modules['voting'] = BlockchainVotingSystem()
    print("✓ Blockchain Voting loaded")
except Exception as e:
    print(f"✗ Blockchain Voting: {e}")

try:
    from evil_twin_detector import EvilTwinDetector
    modules['evil_twin'] = EvilTwinDetector()
    print("✓ Evil Twin Detection loaded")
except Exception as e:
    print(f"✗ Evil Twin Detection: {e}")

print(f"\nLoaded {len(modules)} security modules\n")

class APIHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        if self.path.startswith('/api/'):
            self.handle_api_request()
        else:
            self.send_error(404)
    
    def handle_api_request(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length > 0:
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
            except:
                data = {}
        else:
            data = {}
        
        response_data = {'success': False, 'error': 'Unknown endpoint'}
        
        try:
            # 1. Password Security
            if self.path == '/api/password/check':
                password = data.get('password', '')
                score, strength, feedback = modules['password'].check_strength(password)
                response_data = {'success': True, 'score': score, 'strength': strength, 'feedback': feedback}
            
            elif self.path == '/api/password/generate':
                length = data.get('length', 16)
                password = modules['password'].generate_password(length=length)
                response_data = {'success': True, 'password': password}
            
            elif self.path == '/api/password/validate':
                password = data.get('password', '')
                is_valid = modules['password'].validate_password(password)
                response_data = {'success': True, 'valid': is_valid}
            
            # 2. File Encryption
            elif self.path == '/api/encryption/encrypt-string':
                text = data.get('text', '')
                password = data.get('password', '')
                encrypted = modules['encryption'].encrypt_string(text, password)
                response_data = {'success': True, 'encrypted': encrypted}
            
            elif self.path == '/api/encryption/decrypt-string':
                encrypted = data.get('encrypted', '')
                password = data.get('password', '')
                decrypted = modules['encryption'].decrypt_string(encrypted, password)
                response_data = {'success': True, 'decrypted': decrypted}
            
            # 3. Network Security
            elif self.path == '/api/network/check-port':
                host = data.get('host', '')
                port = int(data.get('port', 80))
                is_open, status = modules['network'].check_port(host, port)
                response_data = {'success': True, 'is_open': is_open, 'status': status}
            
            elif self.path == '/api/network/check-ssl':
                url = data.get('url', '')
                result = modules['network'].check_website_ssl(url)
                response_data = {'success': True, 'result': result}
            
            # 4. Security Utilities
            elif self.path == '/api/utilities/hash':
                text = data.get('text', '')
                algorithm = data.get('algorithm', 'sha256')
                hash_value = modules['utilities'].hash_string(text, algorithm)
                response_data = {'success': True, 'hash': hash_value}
            
            elif self.path == '/api/utilities/generate-api-key':
                length = data.get('length', 32)
                key = modules['utilities'].generate_api_key(length)
                response_data = {'success': True, 'key': key}
            
            # 5. Data Privacy
            elif self.path == '/api/privacy/detect':
                text = data.get('text', '')
                detected = modules['privacy'].detect_sensitive_data(text)
                response_data = {'success': True, 'detected': detected}
            
            elif self.path == '/api/privacy/mask-email':
                email = data.get('email', '')
                masked = modules['privacy'].mask_email(email)
                response_data = {'success': True, 'masked': masked}
            
            # 6. Two-Factor Auth
            elif self.path == '/api/2fa/generate-secret':
                length = data.get('length', 32)
                secret = modules['2fa'].generate_secret_key(length)
                response_data = {'success': True, 'secret': secret}
            
            elif self.path == '/api/2fa/generate-totp':
                secret = data.get('secret', '')
                code = modules['2fa'].generate_totp(secret)
                remaining = modules['2fa'].get_remaining_time()
                response_data = {'success': True, 'code': code, 'remaining': remaining}
            
            elif self.path == '/api/2fa/verify':
                secret = data.get('secret', '')
                code = data.get('code', '')
                is_valid = modules['2fa'].verify_totp(secret, code)
                response_data = {'success': True, 'valid': is_valid}
            
            # 7. Secure Deletion (Info only - actual deletion disabled for safety)
            elif self.path == '/api/deletion/info':
                response_data = {'success': True, 'info': 'Secure file deletion requires file path. For safety, this feature is available via command line only.'}
            
            # 8. URL Security
            elif self.path == '/api/url/analyze':
                url = data.get('url', '')
                result = modules['url'].analyze_url(url)
                response_data = {'success': True, 'result': result}
            
            # 9. Email Security
            elif self.path == '/api/email/analyze':
                email_content = data.get('email_content', '')
                result = modules['email'].analyze_full_email(email_content)
                response_data = {'success': True, 'result': result}
            
            # 10. Security Headers
            elif self.path == '/api/headers/check':
                url = data.get('url', '')
                result = modules['headers'].check_security_headers(url)
                response_data = {'success': True, 'result': result}
            
            # 11. Security Audit
            elif self.path == '/api/audit/analyze-log':
                log_file = data.get('log_file', '')
                pattern_type = data.get('pattern_type', 'all')
                if os.path.exists(log_file):
                    result = modules['audit'].analyze_log_file(log_file, pattern_type)
                    response_data = {'success': True, 'result': result}
                else:
                    response_data = {'success': False, 'error': 'Log file not found. Please provide a valid file path.'}
            
            # 12. Certificate Analyzer
            elif self.path == '/api/certificate/analyze':
                hostname = data.get('hostname', '')
                port = int(data.get('port', 443))
                result = modules['certificate'].analyze_certificate(hostname, port)
                response_data = {'success': True, 'result': result}
            
            # 13. Backup Verification
            elif self.path == '/api/backup/verify':
                backup_file = data.get('backup_file', '')
                original_hash = data.get('original_hash', None)
                if os.path.exists(backup_file):
                    result = modules['backup'].verify_backup_integrity(backup_file, original_hash)
                    response_data = {'success': True, 'result': result}
                else:
                    response_data = {'success': False, 'error': 'Backup file not found. Please provide a valid file path.'}
            
            # 14. Config Security
            elif self.path == '/api/config/check-password-policy':
                result = modules['config'].check_password_policy()
                response_data = {'success': True, 'result': result}
            
            # 15. Phishing Detection
            elif self.path == '/api/phishing/detect':
                url = data.get('url', '')
                deep = data.get('deep', True)
                result = modules['phishing'].detect_phishing(url, deep_analysis=deep)
                response_data = {'success': True, 'result': result}
            
            # 16. Intrusion Detection
            elif self.path == '/api/ids/analyze-log':
                log_entry = data.get('log_entry', '')
                source_ip = data.get('source_ip', None)
                result = modules['ids'].analyze_log_entry(log_entry, source_ip)
                response_data = {'success': True, 'result': result}
            
            # 17. Malware Detection
            elif self.path == '/api/malware/detect':
                file_path = data.get('file_path', '')
                use_ml = data.get('use_ml', True)
                if os.path.exists(file_path):
                    result = modules['malware'].detect_malware(file_path, use_ml=use_ml)
                    response_data = {'success': True, 'result': result}
                else:
                    response_data = {'success': False, 'error': 'File not found. Please provide a valid file path.'}
            
            # 18. Email Spam Detection
            elif self.path == '/api/email-spam/analyze':
                email_content = data.get('email_content', '')
                result = modules['email_spam'].analyze_email(email_content)
                response_data = {'success': True, 'result': result}
            
            # 19. Keylogger Detection
            elif self.path == '/api/keylogger/detect':
                result = modules['keylogger'].detect_keylogger_processes()
                response_data = {'success': True, 'result': result}
            
            # 20. Blockchain Voting
            elif self.path == '/api/voting/register':
                voter_id = data.get('voter_id', '')
                result = modules['voting'].register_voter(voter_id)
                response_data = {'success': True, 'result': result}
            
            elif self.path == '/api/voting/cast':
                voter_id = data.get('voter_id', '')
                candidate = data.get('candidate', '')
                result = modules['voting'].cast_vote(voter_id, candidate)
                response_data = {'success': True, 'result': result}
            
            elif self.path == '/api/voting/results':
                result = modules['voting'].get_results()
                response_data = {'success': True, 'result': result}
            
            # 21. Evil Twin Detection
            elif self.path == '/api/evil-twin/scan':
                result = modules['evil_twin'].scan_wifi_networks()
                response_data = {'success': True, 'result': result}
            
            elif self.path == '/api/evil-twin/detect':
                ssid = data.get('ssid', '')
                result = modules['evil_twin'].detect_evil_twin(ssid)
                response_data = {'success': True, 'result': result}
            
            # Health check
            elif self.path == '/api/health':
                response_data = {'status': 'ok', 'modules_loaded': MODULES_LOADED, 'modules_count': len(modules)}
            
        except KeyError as e:
            response_data = {'success': False, 'error': f'Module not loaded: {str(e)}'}
        except Exception as e:
            response_data = {'success': False, 'error': str(e)}
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(response_data).encode('utf-8'))
    
    def do_GET(self):
        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'modules_loaded': MODULES_LOADED, 'modules_count': len(modules)}).encode('utf-8'))
        else:
            super().do_GET()

if __name__ == '__main__':
    print("=" * 60)
    print("Cybersecurity Solutions API Server - ALL 21 FEATURES")
    print("=" * 60)
    print(f"Server starting on http://localhost:{PORT}")
    print(f"Modules loaded: {len(modules)}/21")
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    
    with socketserver.TCPServer(("", PORT), APIHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
