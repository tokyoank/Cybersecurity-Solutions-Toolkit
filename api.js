// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Check API connection on load
async function checkAPIConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const result = await response.json();
        if (!result.modules_loaded) {
            console.warn('Some security modules failed to load. Some features may not work.');
        }
    } catch (error) {
        console.error('API server is not running. Please start the Flask backend (python app.py)');
        showAPIConnectionWarning();
    }
}

function showAPIConnectionWarning() {
    const warning = document.createElement('div');
    warning.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #f59e0b;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        max-width: 300px;
    `;
    warning.innerHTML = `
        <strong>⚠ API Server Not Running</strong><br>
        Please start the backend: <code>python simple_server.py</code>
    `;
    document.body.appendChild(warning);
    
    setTimeout(() => {
        warning.style.opacity = '0';
        setTimeout(() => warning.remove(), 300);
    }, 5000);
}

// Check connection on page load
window.addEventListener('load', checkAPIConnection);

// Modal Management
const modal = document.getElementById('featureModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');

// Close modal
modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Open feature modal
function openFeatureModal(feature) {
    modal.style.display = 'block';
    modalBody.innerHTML = getFeatureForm(feature);
    
    // Initialize form handlers
    initializeFeatureForm(feature);
}

// Get feature form HTML
function getFeatureForm(feature) {
    const forms = {
        password: `
            <h2>🔑 Password Security</h2>
            <div class="feature-tabs">
                <button class="tab-btn active" onclick="switchTab('password', 'check')">Check Strength</button>
                <button class="tab-btn" onclick="switchTab('password', 'generate')">Generate</button>
                <button class="tab-btn" onclick="switchTab('password', 'validate')">Validate</button>
            </div>
            <div id="password-check" class="tab-content active">
                <div class="form-group">
                    <label>Enter Password:</label>
                    <input type="password" id="password-input" placeholder="Enter password to check">
                </div>
                <button class="btn btn-primary" onclick="checkPasswordStrength()">Check Strength</button>
                <div id="password-result" class="result-box"></div>
            </div>
            <div id="password-generate" class="tab-content">
                <div class="form-group">
                    <label>Password Length:</label>
                    <input type="number" id="password-length" value="16" min="8" max="128">
                </div>
                <button class="btn btn-primary" onclick="generatePassword()">Generate Password</button>
                <div id="password-gen-result" class="result-box"></div>
            </div>
            <div id="password-validate" class="tab-content">
                <div class="form-group">
                    <label>Enter Password:</label>
                    <input type="password" id="password-validate-input" placeholder="Enter password to validate">
                </div>
                <button class="btn btn-primary" onclick="validatePassword()">Validate</button>
                <div id="password-validate-result" class="result-box"></div>
            </div>
        `,
        encryption: `
            <h2>🔐 File Encryption</h2>
            <div class="feature-tabs">
                <button class="tab-btn active" onclick="switchTab('encryption', 'encrypt')">Encrypt</button>
                <button class="tab-btn" onclick="switchTab('encryption', 'decrypt')">Decrypt</button>
            </div>
            <div id="encryption-encrypt" class="tab-content active">
                <div class="form-group">
                    <label>Text to Encrypt:</label>
                    <textarea id="encrypt-text" rows="4" placeholder="Enter text to encrypt"></textarea>
                </div>
                <div class="form-group">
                    <label>Password:</label>
                    <input type="password" id="encrypt-password" placeholder="Enter encryption password">
                </div>
                <button class="btn btn-primary" onclick="encryptString()">Encrypt</button>
                <div id="encrypt-result" class="result-box"></div>
            </div>
            <div id="encryption-decrypt" class="tab-content">
                <div class="form-group">
                    <label>Encrypted Text:</label>
                    <textarea id="decrypt-text" rows="4" placeholder="Enter encrypted text"></textarea>
                </div>
                <div class="form-group">
                    <label>Password:</label>
                    <input type="password" id="decrypt-password" placeholder="Enter decryption password">
                </div>
                <button class="btn btn-primary" onclick="decryptString()">Decrypt</button>
                <div id="decrypt-result" class="result-box"></div>
            </div>
        `,
        network: `
            <h2>🌐 Network Security</h2>
            <div class="feature-tabs">
                <button class="tab-btn active" onclick="switchTab('network', 'port')">Check Port</button>
                <button class="tab-btn" onclick="switchTab('network', 'ssl')">Check SSL</button>
            </div>
            <div id="network-port" class="tab-content active">
                <div class="form-group">
                    <label>Host:</label>
                    <input type="text" id="port-host" placeholder="example.com or 192.168.1.1">
                </div>
                <div class="form-group">
                    <label>Port:</label>
                    <input type="number" id="port-number" value="80" min="1" max="65535">
                </div>
                <button class="btn btn-primary" onclick="checkPort()">Check Port</button>
                <div id="port-result" class="result-box"></div>
            </div>
            <div id="network-ssl" class="tab-content">
                <div class="form-group">
                    <label>URL:</label>
                    <input type="url" id="ssl-url" placeholder="https://example.com">
                </div>
                <button class="btn btn-primary" onclick="checkSSL()">Check SSL</button>
                <div id="ssl-result" class="result-box"></div>
            </div>
        `,
        utilities: `
            <h2>🔧 Security Utilities</h2>
            <div class="feature-tabs">
                <button class="tab-btn active" onclick="switchTab('utilities', 'hash')">Hash</button>
                <button class="tab-btn" onclick="switchTab('utilities', 'apikey')">Generate API Key</button>
            </div>
            <div id="utilities-hash" class="tab-content active">
                <div class="form-group">
                    <label>Text to Hash:</label>
                    <textarea id="hash-text" rows="4" placeholder="Enter text to hash"></textarea>
                </div>
                <div class="form-group">
                    <label>Algorithm:</label>
                    <select id="hash-algorithm">
                        <option value="sha256">SHA-256</option>
                        <option value="sha512">SHA-512</option>
                        <option value="md5">MD5</option>
                        <option value="sha1">SHA-1</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="hashString()">Generate Hash</button>
                <div id="hash-result" class="result-box"></div>
            </div>
            <div id="utilities-apikey" class="tab-content">
                <div class="form-group">
                    <label>Key Length (bytes):</label>
                    <input type="number" id="apikey-length" value="32" min="16" max="128">
                </div>
                <button class="btn btn-primary" onclick="generateAPIKey()">Generate API Key</button>
                <div id="apikey-result" class="result-box"></div>
            </div>
        `,
        privacy: `
            <h2>🔒 Data Privacy</h2>
            <div class="feature-tabs">
                <button class="tab-btn active" onclick="switchTab('privacy', 'detect')">Detect Data</button>
                <button class="tab-btn" onclick="switchTab('privacy', 'mask')">Mask Email</button>
            </div>
            <div id="privacy-detect" class="tab-content active">
                <div class="form-group">
                    <label>Text to Analyze:</label>
                    <textarea id="privacy-text" rows="6" placeholder="Enter text containing sensitive data"></textarea>
                </div>
                <button class="btn btn-primary" onclick="detectSensitiveData()">Detect</button>
                <div id="privacy-result" class="result-box"></div>
            </div>
            <div id="privacy-mask" class="tab-content">
                <div class="form-group">
                    <label>Email Address:</label>
                    <input type="email" id="mask-email" placeholder="user@example.com">
                </div>
                <button class="btn btn-primary" onclick="maskEmail()">Mask Email</button>
                <div id="mask-result" class="result-box"></div>
            </div>
        `,
        '2fa': `
            <h2>🔑 Two-Factor Authentication</h2>
            <div class="feature-tabs">
                <button class="tab-btn active" onclick="switchTab('2fa', 'generate')">Generate Secret</button>
                <button class="tab-btn" onclick="switchTab('2fa', 'totp')">Generate TOTP</button>
                <button class="tab-btn" onclick="switchTab('2fa', 'verify')">Verify</button>
            </div>
            <div id="2fa-generate" class="tab-content active">
                <div class="form-group">
                    <label>Secret Length (bytes):</label>
                    <input type="number" id="secret-length" value="32" min="16" max="64">
                </div>
                <button class="btn btn-primary" onclick="generateSecret()">Generate Secret Key</button>
                <div id="secret-result" class="result-box"></div>
            </div>
            <div id="2fa-totp" class="tab-content">
                <div class="form-group">
                    <label>Secret Key:</label>
                    <input type="text" id="totp-secret" placeholder="Enter secret key">
                </div>
                <button class="btn btn-primary" onclick="generateTOTP()">Generate TOTP</button>
                <div id="totp-result" class="result-box"></div>
            </div>
            <div id="2fa-verify" class="tab-content">
                <div class="form-group">
                    <label>Secret Key:</label>
                    <input type="text" id="verify-secret" placeholder="Enter secret key">
                </div>
                <div class="form-group">
                    <label>TOTP Code:</label>
                    <input type="text" id="verify-code" placeholder="Enter 6-digit code" maxlength="6">
                </div>
                <button class="btn btn-primary" onclick="verifyTOTP()">Verify</button>
                <div id="verify-result" class="result-box"></div>
            </div>
        `,
        url: `
            <h2>🔗 URL Security</h2>
            <div class="form-group">
                <label>URL to Analyze:</label>
                <input type="url" id="url-input" placeholder="https://example.com">
            </div>
            <button class="btn btn-primary" onclick="analyzeURL()">Analyze URL</button>
            <div id="url-result" class="result-box"></div>
        `,
        phishing: `
            <h2>🎣 Phishing Detection</h2>
            <div class="form-group">
                <label>URL to Check:</label>
                <input type="url" id="phishing-url" placeholder="https://example.com">
            </div>
            <button class="btn btn-primary" onclick="detectPhishing()">Detect Phishing</button>
            <div id="phishing-result" class="result-box"></div>
        `,
        email: `
            <h2>📧 Email Security</h2>
            <div class="form-group">
                <label>Email Content (Headers + Body):</label>
                <textarea id="email-content" rows="10" placeholder="Paste email content here"></textarea>
            </div>
            <button class="btn btn-primary" onclick="analyzeEmail()">Analyze Email</button>
            <div id="email-result" class="result-box"></div>
        `,
        headers: `
            <h2>🛡️ Security Headers</h2>
            <div class="form-group">
                <label>URL to Check:</label>
                <input type="url" id="headers-url" placeholder="https://example.com">
            </div>
            <button class="btn btn-primary" onclick="checkHeaders()">Check Headers</button>
            <div id="headers-result" class="result-box"></div>
        `,
        certificate: `
            <h2>📜 Certificate Analyzer</h2>
            <div class="form-group">
                <label>Hostname:</label>
                <input type="text" id="cert-hostname" placeholder="example.com">
            </div>
            <div class="form-group">
                <label>Port:</label>
                <input type="number" id="cert-port" value="443" min="1" max="65535">
            </div>
            <button class="btn btn-primary" onclick="analyzeCertificate()">Analyze Certificate</button>
            <div id="cert-result" class="result-box"></div>
        `,
        deletion: `
            <h2>🗑️ Secure File Deletion</h2>
            <div class="result-box info">
                <p><strong>⚠️ Safety Notice:</strong></p>
                <p>Secure file deletion permanently removes files. For safety, this feature requires direct file path access and is available via command line only.</p>
                <p>Use the Python toolkit directly: <code>python main.py</code> and select option 7.</p>
            </div>
        `,
        audit: `
            <h2>📊 Security Audit</h2>
            <div class="form-group">
                <label>Log File Path:</label>
                <input type="text" id="audit-log-file" placeholder="C:\\path\\to\\logfile.log">
            </div>
            <div class="form-group">
                <label>Pattern Type:</label>
                <select id="audit-pattern">
                    <option value="all">All Patterns</option>
                    <option value="failed_login">Failed Login</option>
                    <option value="suspicious_activity">Suspicious Activity</option>
                    <option value="sql_injection">SQL Injection</option>
                    <option value="xss_attempts">XSS Attempts</option>
                </select>
            </div>
            <button class="btn btn-primary" onclick="analyzeLogFile()">Analyze Log File</button>
            <div id="audit-result" class="result-box"></div>
        `,
        backup: `
            <h2>💾 Backup Verification</h2>
            <div class="form-group">
                <label>Backup File Path:</label>
                <input type="text" id="backup-file" placeholder="C:\\path\\to\\backup.file">
            </div>
            <div class="form-group">
                <label>Original Hash (Optional):</label>
                <input type="text" id="backup-hash" placeholder="Leave empty if unknown">
            </div>
            <button class="btn btn-primary" onclick="verifyBackup()">Verify Backup</button>
            <div id="backup-result" class="result-box"></div>
        `,
        config: `
            <h2>⚙️ Config Security</h2>
            <button class="btn btn-primary" onclick="checkPasswordPolicy()">Check Password Policy</button>
            <div id="config-result" class="result-box"></div>
        `,
        ids: `
            <h2>🚨 Intrusion Detection System</h2>
            <div class="form-group">
                <label>Log Entry:</label>
                <textarea id="ids-log-entry" rows="4" placeholder="Enter log entry to analyze"></textarea>
            </div>
            <div class="form-group">
                <label>Source IP (Optional):</label>
                <input type="text" id="ids-source-ip" placeholder="192.168.1.1">
            </div>
            <button class="btn btn-primary" onclick="analyzeLogEntry()">Analyze Log Entry</button>
            <div id="ids-result" class="result-box"></div>
        `,
        malware: `
            <h2>🦠 Malware Detection</h2>
            <div class="form-group">
                <label>File Path:</label>
                <input type="text" id="malware-file-path" placeholder="C:\\path\\to\\file.exe">
            </div>
            <div class="form-group">
                <label>Use ML Detection:</label>
                <input type="checkbox" id="malware-use-ml" checked>
            </div>
            <button class="btn btn-primary" onclick="detectMalware()">Detect Malware</button>
            <div id="malware-result" class="result-box"></div>
        `,
        'email-spam': `
            <h2>📨 Email Spam Detection</h2>
            <div class="form-group">
                <label>Email Content:</label>
                <textarea id="email-spam-content" rows="10" placeholder="Paste email content here"></textarea>
            </div>
            <button class="btn btn-primary" onclick="analyzeEmailSpam()">Analyze Email</button>
            <div id="email-spam-result" class="result-box"></div>
        `,
        keylogger: `
            <h2>⌨️ Keylogger Detection</h2>
            <button class="btn btn-primary" onclick="detectKeylogger()">Scan for Keyloggers</button>
            <div id="keylogger-result" class="result-box"></div>
        `,
        voting: `
            <h2>⛓️ Blockchain Voting</h2>
            <div class="feature-tabs">
                <button class="tab-btn active" onclick="switchTab('voting', 'register')">Register</button>
                <button class="tab-btn" onclick="switchTab('voting', 'cast')">Cast Vote</button>
                <button class="tab-btn" onclick="switchTab('voting', 'results')">View Results</button>
            </div>
            <div id="voting-register" class="tab-content active">
                <div class="form-group">
                    <label>Voter ID:</label>
                    <input type="text" id="voter-id" placeholder="Enter voter ID">
                </div>
                <button class="btn btn-primary" onclick="registerVoter()">Register Voter</button>
                <div id="voting-register-result" class="result-box"></div>
            </div>
            <div id="voting-cast" class="tab-content">
                <div class="form-group">
                    <label>Voter ID:</label>
                    <input type="text" id="cast-voter-id" placeholder="Enter voter ID">
                </div>
                <div class="form-group">
                    <label>Candidate/Option:</label>
                    <input type="text" id="cast-candidate" placeholder="Enter candidate name">
                </div>
                <button class="btn btn-primary" onclick="castVote()">Cast Vote</button>
                <div id="voting-cast-result" class="result-box"></div>
            </div>
            <div id="voting-results" class="tab-content">
                <button class="btn btn-primary" onclick="getVotingResults()">Get Results</button>
                <div id="voting-results-result" class="result-box"></div>
            </div>
        `,
        'evil-twin': `
            <h2>📡 Evil Twin Detection</h2>
            <div class="feature-tabs">
                <button class="tab-btn active" onclick="switchTab('evil-twin', 'scan')">Scan Networks</button>
                <button class="tab-btn" onclick="switchTab('evil-twin', 'detect')">Detect Evil Twin</button>
            </div>
            <div id="evil-twin-scan" class="tab-content active">
                <button class="btn btn-primary" onclick="scanWiFiNetworks()">Scan Wi-Fi Networks</button>
                <div id="evil-twin-scan-result" class="result-box"></div>
            </div>
            <div id="evil-twin-detect" class="tab-content">
                <div class="form-group">
                    <label>SSID to Check:</label>
                    <input type="text" id="evil-twin-ssid" placeholder="Network Name">
                </div>
                <button class="btn btn-primary" onclick="detectEvilTwin()">Detect Evil Twin</button>
                <div id="evil-twin-detect-result" class="result-box"></div>
            </div>
        `
    };
    
    return forms[feature] || '<p>Feature form not available</p>';
}

// Tab switching
function switchTab(feature, tab) {
    // Hide all tabs for this feature
    const allTabs = document.querySelectorAll(`[id^="${feature}-"]`);
    allTabs.forEach(el => {
        if (el.classList.contains('tab-content')) {
            el.classList.remove('active');
        }
    });
    
    // Show selected tab
    const tabContent = document.getElementById(`${feature}-${tab}`);
    if (tabContent) {
        tabContent.classList.add('active');
    }
    
    // Update button states
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        if (btn.onclick && btn.onclick.toString().includes(`${feature}-${tab}`)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Also activate the clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// Initialize feature form
function initializeFeatureForm(feature) {
    // Form initialization if needed
}

// API Functions
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            return { 
                success: false, 
                error: 'Cannot connect to API server. Please make sure the Flask backend is running (python app.py)' 
            };
        }
        return { success: false, error: error.message };
    }
}

// Password Security Functions
async function checkPasswordStrength() {
    const password = document.getElementById('password-input').value;
    if (!password) {
        showResult('password-result', 'Please enter a password', 'error');
        return;
    }
    
    showResult('password-result', 'Checking...', 'loading');
    const result = await apiCall('/password/check', 'POST', { password });
    
    if (result.success) {
        const html = `
            <div class="result-success">
                <h3>Password Strength: ${result.strength} (${result.score}/100)</h3>
                <div class="strength-bar">
                    <div class="strength-fill" style="width: ${result.score}%; background: ${getStrengthColor(result.score)}"></div>
                </div>
                <ul class="feedback-list">
                    ${result.feedback.map(f => `<li>${f}</li>`).join('')}
                </ul>
            </div>
        `;
        showResult('password-result', html, 'success');
    } else {
        showResult('password-result', `Error: ${result.error}`, 'error');
    }
}

async function generatePassword() {
    const length = parseInt(document.getElementById('password-length').value) || 16;
    showResult('password-gen-result', 'Generating...', 'loading');
    const result = await apiCall('/password/generate', 'POST', { length });
    
    if (result.success) {
        const html = `
            <div class="result-success">
                <h3>Generated Password:</h3>
                <div class="password-display">
                    <code id="gen-password">${result.password}</code>
                    <button class="btn-copy" onclick="copyToClipboard('gen-password')">Copy</button>
                </div>
            </div>
        `;
        showResult('password-gen-result', html, 'success');
    } else {
        showResult('password-gen-result', `Error: ${result.error}`, 'error');
    }
}

async function validatePassword() {
    const password = document.getElementById('password-validate-input').value;
    if (!password) {
        showResult('password-validate-result', 'Please enter a password', 'error');
        return;
    }
    
    showResult('password-validate-result', 'Validating...', 'loading');
    const result = await apiCall('/password/validate', 'POST', { password });
    
    if (result.success) {
        const html = `
            <div class="result-${result.valid ? 'success' : 'error'}">
                <h3>Password is ${result.valid ? 'VALID ✓' : 'INVALID ✗'}</h3>
            </div>
        `;
        showResult('password-validate-result', html, result.valid ? 'success' : 'error');
    } else {
        showResult('password-validate-result', `Error: ${result.error}`, 'error');
    }
}

// Encryption Functions
async function encryptString() {
    const text = document.getElementById('encrypt-text').value;
    const password = document.getElementById('encrypt-password').value;
    
    if (!text || !password) {
        showResult('encrypt-result', 'Please enter text and password', 'error');
        return;
    }
    
    showResult('encrypt-result', 'Encrypting...', 'loading');
    const result = await apiCall('/encryption/encrypt-string', 'POST', { text, password });
    
    if (result.success) {
        const html = `
            <div class="result-success">
                <h3>Encrypted Text:</h3>
                <div class="password-display">
                    <code id="encrypted-text">${result.encrypted}</code>
                    <button class="btn-copy" onclick="copyToClipboard('encrypted-text')">Copy</button>
                </div>
            </div>
        `;
        showResult('encrypt-result', html, 'success');
    } else {
        showResult('encrypt-result', `Error: ${result.error}`, 'error');
    }
}

async function decryptString() {
    const encrypted = document.getElementById('decrypt-text').value;
    const password = document.getElementById('decrypt-password').value;
    
    if (!encrypted || !password) {
        showResult('decrypt-result', 'Please enter encrypted text and password', 'error');
        return;
    }
    
    showResult('decrypt-result', 'Decrypting...', 'loading');
    const result = await apiCall('/encryption/decrypt-string', 'POST', { encrypted, password });
    
    if (result.success) {
        const html = `
            <div class="result-success">
                <h3>Decrypted Text:</h3>
                <div class="password-display">
                    <code>${result.decrypted}</code>
                </div>
            </div>
        `;
        showResult('decrypt-result', html, 'success');
    } else {
        showResult('decrypt-result', `Error: ${result.error}`, 'error');
    }
}

// Network Functions
async function checkPort() {
    const host = document.getElementById('port-host').value;
    const port = parseInt(document.getElementById('port-number').value);
    
    if (!host) {
        showResult('port-result', 'Please enter a host', 'error');
        return;
    }
    
    showResult('port-result', 'Checking port...', 'loading');
    const result = await apiCall('/network/check-port', 'POST', { host, port });
    
    if (result.success) {
        const html = `
            <div class="result-${result.is_open ? 'success' : 'info'}">
                <h3>Port ${port} is ${result.is_open ? 'OPEN' : 'CLOSED'}</h3>
                <p>${result.status}</p>
            </div>
        `;
        showResult('port-result', html, result.is_open ? 'success' : 'info');
    } else {
        showResult('port-result', `Error: ${result.error}`, 'error');
    }
}

async function checkSSL() {
    const url = document.getElementById('ssl-url').value;
    
    if (!url) {
        showResult('ssl-result', 'Please enter a URL', 'error');
        return;
    }
    
    showResult('ssl-result', 'Checking SSL...', 'loading');
    const result = await apiCall('/network/check-ssl', 'POST', { url });
    
    if (result.success) {
        const html = `
            <div class="result-success">
                <h3>SSL Certificate Information</h3>
                <pre>${JSON.stringify(result.result, null, 2)}</pre>
            </div>
        `;
        showResult('ssl-result', html, 'success');
    } else {
        showResult('ssl-result', `Error: ${result.error}`, 'error');
    }
}

// Utilities Functions
async function hashString() {
    const text = document.getElementById('hash-text').value;
    const algorithm = document.getElementById('hash-algorithm').value;
    
    if (!text) {
        showResult('hash-result', 'Please enter text to hash', 'error');
        return;
    }
    
    showResult('hash-result', 'Generating hash...', 'loading');
    const result = await apiCall('/utilities/hash', 'POST', { text, algorithm });
    
    if (result.success) {
        const html = `
            <div class="result-success">
                <h3>${algorithm.toUpperCase()} Hash:</h3>
                <div class="password-display">
                    <code id="hash-value">${result.hash}</code>
                    <button class="btn-copy" onclick="copyToClipboard('hash-value')">Copy</button>
                </div>
            </div>
        `;
        showResult('hash-result', html, 'success');
    } else {
        showResult('hash-result', `Error: ${result.error}`, 'error');
    }
}

async function generateAPIKey() {
    const length = parseInt(document.getElementById('apikey-length').value) || 32;
    showResult('apikey-result', 'Generating API key...', 'loading');
    const result = await apiCall('/utilities/generate-api-key', 'POST', { length });
    
    if (result.success) {
        const html = `
            <div class="result-success">
                <h3>API Key:</h3>
                <div class="password-display">
                    <code id="apikey-value">${result.key}</code>
                    <button class="btn-copy" onclick="copyToClipboard('apikey-value')">Copy</button>
                </div>
            </div>
        `;
        showResult('apikey-result', html, 'success');
    } else {
        showResult('apikey-result', `Error: ${result.error}`, 'error');
    }
}

// Privacy Functions
async function detectSensitiveData() {
    const text = document.getElementById('privacy-text').value;
    
    if (!text) {
        showResult('privacy-result', 'Please enter text to analyze', 'error');
        return;
    }
    
    showResult('privacy-result', 'Analyzing...', 'loading');
    const result = await apiCall('/privacy/detect', 'POST', { text });
    
    if (result.success) {
        let html = '<div class="result-success"><h3>Detected Sensitive Data:</h3><ul>';
        for (const [type, values] of Object.entries(result.detected)) {
            html += `<li><strong>${type}:</strong> ${values.join(', ')}</li>`;
        }
        html += '</ul></div>';
        showResult('privacy-result', html, 'success');
    } else {
        showResult('privacy-result', `Error: ${result.error}`, 'error');
    }
}

async function maskEmail() {
    const email = document.getElementById('mask-email').value;
    
    if (!email) {
        showResult('mask-result', 'Please enter an email address', 'error');
        return;
    }
    
    showResult('mask-result', 'Masking...', 'loading');
    const result = await apiCall('/privacy/mask-email', 'POST', { email });
    
    if (result.success) {
        const html = `
            <div class="result-success">
                <h3>Masked Email:</h3>
                <code>${result.masked}</code>
            </div>
        `;
        showResult('mask-result', html, 'success');
    } else {
        showResult('mask-result', `Error: ${result.error}`, 'error');
    }
}

// 2FA Functions
async function generateSecret() {
    const length = parseInt(document.getElementById('secret-length').value) || 32;
    showResult('secret-result', 'Generating secret...', 'loading');
    const result = await apiCall('/2fa/generate-secret', 'POST', { length });
    
    if (result.success) {
        const html = `
            <div class="result-success">
                <h3>Secret Key:</h3>
                <div class="password-display">
                    <code id="secret-key">${result.secret}</code>
                    <button class="btn-copy" onclick="copyToClipboard('secret-key')">Copy</button>
                </div>
                <p class="warning">Keep this secret key secure!</p>
            </div>
        `;
        showResult('secret-result', html, 'success');
    } else {
        showResult('secret-result', `Error: ${result.error}`, 'error');
    }
}

async function generateTOTP() {
    const secret = document.getElementById('totp-secret').value;
    
    if (!secret) {
        showResult('totp-result', 'Please enter a secret key', 'error');
        return;
    }
    
    showResult('totp-result', 'Generating TOTP...', 'loading');
    const result = await apiCall('/2fa/generate-totp', 'POST', { secret });
    
    if (result.success) {
        const html = `
            <div class="result-success">
                <h3>TOTP Code: <strong>${result.code}</strong></h3>
                <p>Valid for ${result.remaining} more seconds</p>
            </div>
        `;
        showResult('totp-result', html, 'success');
    } else {
        showResult('totp-result', `Error: ${result.error}`, 'error');
    }
}

async function verifyTOTP() {
    const secret = document.getElementById('verify-secret').value;
    const code = document.getElementById('verify-code').value;
    
    if (!secret || !code) {
        showResult('verify-result', 'Please enter secret key and code', 'error');
        return;
    }
    
    showResult('verify-result', 'Verifying...', 'loading');
    const result = await apiCall('/2fa/verify', 'POST', { secret, code });
    
    if (result.success) {
        const html = `
            <div class="result-${result.valid ? 'success' : 'error'}">
                <h3>Code is ${result.valid ? 'VALID ✓' : 'INVALID ✗'}</h3>
            </div>
        `;
        showResult('verify-result', html, result.valid ? 'success' : 'error');
    } else {
        showResult('verify-result', `Error: ${result.error}`, 'error');
    }
}

// URL Functions
async function analyzeURL() {
    const url = document.getElementById('url-input').value;
    
    if (!url) {
        showResult('url-result', 'Please enter a URL', 'error');
        return;
    }
    
    showResult('url-result', 'Analyzing URL...', 'loading');
    const result = await apiCall('/url/analyze', 'POST', { url });
    
    if (result.success) {
        const html = `
            <div class="result-success">
                <h3>URL Analysis Results</h3>
                <p><strong>Security Score:</strong> ${result.result.security_score}/100</p>
                <p><strong>Risk Level:</strong> ${result.result.risk_level}</p>
                <p><strong>Is Safe:</strong> ${result.result.is_safe ? 'Yes' : 'No'}</p>
                ${result.result.warnings ? `<p><strong>Warnings:</strong> ${result.result.warnings.join(', ')}</p>` : ''}
            </div>
        `;
        showResult('url-result', html, 'success');
    } else {
        showResult('url-result', `Error: ${result.error}`, 'error');
    }
}

// Phishing Functions
async function detectPhishing() {
    const url = document.getElementById('phishing-url').value;
    
    if (!url) {
        showResult('phishing-result', 'Please enter a URL', 'error');
        return;
    }
    
    showResult('phishing-result', 'Detecting phishing...', 'loading');
    const result = await apiCall('/phishing/detect', 'POST', { url, deep: true });
    
    if (result.success) {
        const html = `
            <div class="result-${result.result.is_phishing ? 'error' : 'success'}">
                <h3>${result.result.is_phishing ? '⚠ PHISHING DETECTED' : '✓ Safe URL'}</h3>
                <p><strong>Confidence:</strong> ${result.result.confidence.toFixed(1)}%</p>
                <p><strong>Risk Level:</strong> ${result.result.risk_level}</p>
                ${result.result.indicators ? `<p><strong>Indicators:</strong> ${result.result.indicators.join(', ')}</p>` : ''}
            </div>
        `;
        showResult('phishing-result', html, result.result.is_phishing ? 'error' : 'success');
    } else {
        showResult('phishing-result', `Error: ${result.error}`, 'error');
    }
}

// Email Functions
async function analyzeEmail() {
    const email_content = document.getElementById('email-content').value;
    
    if (!email_content) {
        showResult('email-result', 'Please enter email content', 'error');
        return;
    }
    
    showResult('email-result', 'Analyzing email...', 'loading');
    const result = await apiCall('/email/analyze', 'POST', { email_content });
    
    if (result.success) {
        const html = `
            <div class="result-success">
                <h3>Email Analysis Results</h3>
                <pre>${JSON.stringify(result.result, null, 2)}</pre>
            </div>
        `;
        showResult('email-result', html, 'success');
    } else {
        showResult('email-result', `Error: ${result.error}`, 'error');
    }
}

// Headers Functions
async function checkHeaders() {
    const url = document.getElementById('headers-url').value;
    
    if (!url) {
        showResult('headers-result', 'Please enter a URL', 'error');
        return;
    }
    
    showResult('headers-result', 'Checking headers...', 'loading');
    const result = await apiCall('/headers/check', 'POST', { url });
    
    if (result.success) {
        const html = `
            <div class="result-success">
                <h3>Security Headers Analysis</h3>
                <p><strong>Security Score:</strong> ${result.result.security_score}/100</p>
                <p><strong>Security Level:</strong> ${result.result.security_level}</p>
                <p><strong>Headers Present:</strong> ${Object.keys(result.result.headers_present).length}</p>
                <p><strong>Missing Headers:</strong> ${result.result.headers_missing ? result.result.headers_missing.length : 0}</p>
            </div>
        `;
        showResult('headers-result', html, 'success');
    } else {
        showResult('headers-result', `Error: ${result.error}`, 'error');
    }
}

// Certificate Functions
async function analyzeCertificate() {
    const hostname = document.getElementById('cert-hostname').value;
    const port = parseInt(document.getElementById('cert-port').value) || 443;
    
    if (!hostname) {
        showResult('cert-result', 'Please enter a hostname', 'error');
        return;
    }
    
    showResult('cert-result', 'Analyzing certificate...', 'loading');
    const result = await apiCall('/certificate/analyze', 'POST', { hostname, port });
    
    if (result.success) {
        const html = `
            <div class="result-${result.result.valid ? 'success' : 'error'}">
                <h3>Certificate Analysis</h3>
                <p><strong>Valid:</strong> ${result.result.valid ? 'Yes' : 'No'}</p>
                <p><strong>Expired:</strong> ${result.result.expired ? 'Yes' : 'No'}</p>
                <p><strong>Security Score:</strong> ${result.result.security_score}/100</p>
            </div>
        `;
        showResult('cert-result', html, result.result.valid ? 'success' : 'error');
    } else {
        showResult('cert-result', `Error: ${result.error}`, 'error');
    }
}

// Utility Functions
function showResult(elementId, content, type = 'info') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = content;
        element.className = `result-box result-${type}`;
    }
}

function getStrengthColor(score) {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const text = element.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
    }
}

// Security Audit Functions
async function analyzeLogFile() {
    const log_file = document.getElementById('audit-log-file').value;
    const pattern_type = document.getElementById('audit-pattern').value;
    
    if (!log_file) {
        showResult('audit-result', 'Please enter a log file path', 'error');
        return;
    }
    
    showResult('audit-result', 'Analyzing log file...', 'loading');
    const result = await apiCall('/audit/analyze-log', 'POST', { log_file, pattern_type });
    
    if (result.success) {
        const html = `
            <div class="result-success">
                <h3>Log Analysis Results</h3>
                <p><strong>Total Lines:</strong> ${result.result.total_lines}</p>
                <p><strong>Matches Found:</strong> ${result.result.match_count || 0}</p>
                <p><strong>Severity:</strong> ${result.result.severity}</p>
            </div>
        `;
        showResult('audit-result', html, 'success');
    } else {
        showResult('audit-result', `Error: ${result.error}`, 'error');
    }
}

// Backup Verification Functions
async function verifyBackup() {
    const backup_file = document.getElementById('backup-file').value;
    const original_hash = document.getElementById('backup-hash').value || null;
    
    if (!backup_file) {
        showResult('backup-result', 'Please enter a backup file path', 'error');
        return;
    }
    
    showResult('backup-result', 'Verifying backup...', 'loading');
    const result = await apiCall('/backup/verify', 'POST', { backup_file, original_hash });
    
    if (result.success) {
        const html = `
            <div class="result-success">
                <h3>Backup Verification</h3>
                <p><strong>Exists:</strong> ${result.result.exists ? 'Yes' : 'No'}</p>
                <p><strong>Size:</strong> ${result.result.size ? result.result.size.toLocaleString() : 'N/A'} bytes</p>
                <p><strong>Integrity:</strong> ${result.result.integrity}</p>
                <p><strong>Hash:</strong> ${result.result.hash || 'N/A'}</p>
            </div>
        `;
        showResult('backup-result', html, 'success');
    } else {
        showResult('backup-result', `Error: ${result.error}`, 'error');
    }
}

// Config Security Functions
async function checkPasswordPolicy() {
    showResult('config-result', 'Checking password policy...', 'loading');
    const result = await apiCall('/config/check-password-policy', 'POST', {});
    
    if (result.success) {
        let html = '<div class="result-success"><h3>Password Policy Check</h3><ul>';
        for (const [key, value] of Object.entries(result.result.checks || {})) {
            html += `<li><strong>${key}:</strong> ${value}</li>`;
        }
        html += '</ul></div>';
        showResult('config-result', html, 'success');
    } else {
        showResult('config-result', `Error: ${result.error}`, 'error');
    }
}

// IDS Functions
async function analyzeLogEntry() {
    const log_entry = document.getElementById('ids-log-entry').value;
    const source_ip = document.getElementById('ids-source-ip').value || null;
    
    if (!log_entry) {
        showResult('ids-result', 'Please enter a log entry', 'error');
        return;
    }
    
    showResult('ids-result', 'Analyzing log entry...', 'loading');
    const result = await apiCall('/ids/analyze-log', 'POST', { log_entry, source_ip });
    
    if (result.success) {
        const html = `
            <div class="result-${result.result.suspicious ? 'error' : 'success'}">
                <h3>Log Analysis</h3>
                <p><strong>Suspicious:</strong> ${result.result.suspicious ? 'Yes ⚠' : 'No ✓'}</p>
                <p><strong>Confidence:</strong> ${result.result.confidence.toFixed(1)}%</p>
                ${result.result.threat_types ? `<p><strong>Threat Types:</strong> ${result.result.threat_types.join(', ')}</p>` : ''}
            </div>
        `;
        showResult('ids-result', html, result.result.suspicious ? 'error' : 'success');
    } else {
        showResult('ids-result', `Error: ${result.error}`, 'error');
    }
}

// Malware Detection Functions
async function detectMalware() {
    const file_path = document.getElementById('malware-file-path').value;
    const use_ml = document.getElementById('malware-use-ml').checked;
    
    if (!file_path) {
        showResult('malware-result', 'Please enter a file path', 'error');
        return;
    }
    
    showResult('malware-result', 'Detecting malware...', 'loading');
    const result = await apiCall('/malware/detect', 'POST', { file_path, use_ml });
    
    if (result.success) {
        const html = `
            <div class="result-${result.result.is_malware ? 'error' : 'success'}">
                <h3>Malware Detection Results</h3>
                <p><strong>Is Malware:</strong> ${result.result.is_malware ? '⚠ YES' : '✓ NO'}</p>
                <p><strong>Confidence:</strong> ${result.result.confidence.toFixed(1)}%</p>
                <p><strong>Risk Level:</strong> ${result.result.risk_level}</p>
                <p><strong>Detection Method:</strong> ${result.result.detection_method}</p>
            </div>
        `;
        showResult('malware-result', html, result.result.is_malware ? 'error' : 'success');
    } else {
        showResult('malware-result', `Error: ${result.error}`, 'error');
    }
}

// Email Spam Functions
async function analyzeEmailSpam() {
    const email_content = document.getElementById('email-spam-content').value;
    
    if (!email_content) {
        showResult('email-spam-result', 'Please enter email content', 'error');
        return;
    }
    
    showResult('email-spam-result', 'Analyzing email...', 'loading');
    const result = await apiCall('/email-spam/analyze', 'POST', { email_content });
    
    if (result.success) {
        const html = `
            <div class="result-${result.result.is_spam || result.result.is_phishing ? 'error' : 'success'}">
                <h3>Email Analysis Results</h3>
                <p><strong>Spam:</strong> ${result.result.is_spam ? '⚠ YES' : '✓ NO'} (Score: ${result.result.spam_score.toFixed(1)}%)</p>
                <p><strong>Phishing:</strong> ${result.result.is_phishing ? '⚠ YES' : '✓ NO'} (Score: ${result.result.phishing_score.toFixed(1)}%)</p>
                <p><strong>Overall Risk:</strong> ${result.result.overall_risk}</p>
            </div>
        `;
        showResult('email-spam-result', html, result.result.is_spam || result.result.is_phishing ? 'error' : 'success');
    } else {
        showResult('email-spam-result', `Error: ${result.error}`, 'error');
    }
}

// Keylogger Detection Functions
async function detectKeylogger() {
    showResult('keylogger-result', 'Scanning for keyloggers...', 'loading');
    const result = await apiCall('/keylogger/detect', 'POST', {});
    
    if (result.success) {
        const html = `
            <div class="result-${result.result.keyloggers_detected ? 'error' : 'success'}">
                <h3>Keylogger Detection Results</h3>
                <p><strong>Keyloggers Detected:</strong> ${result.result.keyloggers_detected ? '⚠ YES' : '✓ NO'}</p>
                <p><strong>Processes Checked:</strong> ${result.result.total_processes_checked}</p>
                ${result.result.suspicious_processes && result.result.suspicious_processes.length > 0 ? 
                    `<p><strong>Suspicious Processes:</strong></p><ul>${result.result.suspicious_processes.slice(0, 5).map(p => `<li>${p.name} (PID: ${p.pid}) - ${p.reason}</li>`).join('')}</ul>` : ''}
            </div>
        `;
        showResult('keylogger-result', html, result.result.keyloggers_detected ? 'error' : 'success');
    } else {
        showResult('keylogger-result', `Error: ${result.error}`, 'error');
    }
}

// Blockchain Voting Functions
async function registerVoter() {
    const voter_id = document.getElementById('voter-id').value;
    
    if (!voter_id) {
        showResult('voting-register-result', 'Please enter a voter ID', 'error');
        return;
    }
    
    showResult('voting-register-result', 'Registering voter...', 'loading');
    const result = await apiCall('/voting/register', 'POST', { voter_id });
    
    if (result.success) {
        const html = `
            <div class="result-${result.result.success ? 'success' : 'error'}">
                <h3>${result.result.message}</h3>
            </div>
        `;
        showResult('voting-register-result', html, result.result.success ? 'success' : 'error');
    } else {
        showResult('voting-register-result', `Error: ${result.error}`, 'error');
    }
}

async function castVote() {
    const voter_id = document.getElementById('cast-voter-id').value;
    const candidate = document.getElementById('cast-candidate').value;
    
    if (!voter_id || !candidate) {
        showResult('voting-cast-result', 'Please enter voter ID and candidate', 'error');
        return;
    }
    
    showResult('voting-cast-result', 'Casting vote...', 'loading');
    const result = await apiCall('/voting/cast', 'POST', { voter_id, candidate });
    
    if (result.success) {
        const html = `
            <div class="result-${result.result.success ? 'success' : 'error'}">
                <h3>${result.result.message}</h3>
                ${result.result.vote_id ? `<p><strong>Vote ID:</strong> ${result.result.vote_id}</p>` : ''}
            </div>
        `;
        showResult('voting-cast-result', html, result.result.success ? 'success' : 'error');
    } else {
        showResult('voting-cast-result', `Error: ${result.error}`, 'error');
    }
}

async function getVotingResults() {
    showResult('voting-results-result', 'Getting results...', 'loading');
    const result = await apiCall('/voting/results', 'POST', {});
    
    if (result.success) {
        let html = '<div class="result-success"><h3>Voting Results</h3>';
        html += `<p><strong>Total Votes:</strong> ${result.result.total_votes}</p>`;
        html += `<p><strong>Blocks:</strong> ${result.result.blocks_count}</p>`;
        html += '<h4>Results:</h4><ul>';
        for (const [candidate, votes] of Object.entries(result.result.results || {})) {
            const percentage = result.result.total_votes > 0 ? (votes / result.result.total_votes * 100).toFixed(1) : 0;
            html += `<li><strong>${candidate}:</strong> ${votes} votes (${percentage}%)</li>`;
        }
        html += '</ul></div>';
        showResult('voting-results-result', html, 'success');
    } else {
        showResult('voting-results-result', `Error: ${result.error}`, 'error');
    }
}

// Evil Twin Detection Functions
async function scanWiFiNetworks() {
    showResult('evil-twin-scan-result', 'Scanning Wi-Fi networks...', 'loading');
    const result = await apiCall('/evil-twin/scan', 'POST', {});
    
    if (result.success) {
        const html = `
            <div class="result-success">
                <h3>Wi-Fi Network Scan</h3>
                <p><strong>Networks Found:</strong> ${result.result.total_networks}</p>
                <p><strong>Suspicious Networks:</strong> ${result.result.suspicious_networks ? result.result.suspicious_networks.length : 0}</p>
                ${result.result.error ? `<p class="warning">Note: ${result.result.error}</p>` : ''}
            </div>
        `;
        showResult('evil-twin-scan-result', html, 'success');
    } else {
        showResult('evil-twin-scan-result', `Error: ${result.error}`, 'error');
    }
}

async function detectEvilTwin() {
    const ssid = document.getElementById('evil-twin-ssid').value;
    
    if (!ssid) {
        showResult('evil-twin-detect-result', 'Please enter an SSID', 'error');
        return;
    }
    
    showResult('evil-twin-detect-result', 'Detecting evil twin...', 'loading');
    const result = await apiCall('/evil-twin/detect', 'POST', { ssid });
    
    if (result.success) {
        const html = `
            <div class="result-${result.result.evil_twin_detected ? 'error' : 'success'}">
                <h3>Evil Twin Detection</h3>
                <p><strong>Evil Twin Detected:</strong> ${result.result.evil_twin_detected ? '⚠ YES' : '✓ NO'}</p>
                ${result.result.suspicious_networks && result.result.suspicious_networks.length > 0 ? 
                    `<p><strong>Suspicious Networks:</strong> ${result.result.suspicious_networks.length}</p>` : ''}
            </div>
        `;
        showResult('evil-twin-detect-result', html, result.result.evil_twin_detected ? 'error' : 'success');
    } else {
        showResult('evil-twin-detect-result', `Error: ${result.error}`, 'error');
    }
}
