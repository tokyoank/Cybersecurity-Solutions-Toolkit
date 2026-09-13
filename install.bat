@echo off
echo Installing Cybersecurity Solutions API Dependencies...
echo.

echo Installing Flask and core dependencies...
pip install Flask==3.0.0 flask-cors==4.0.0 cryptography==41.0.7 requests==2.31.0 colorama==0.4.6 argon2-cffi==23.1.0 pyotp==2.9.0 dnspython==2.6.1

echo.
echo Installation complete!
echo.
echo Note: python-nmap and scikit-learn are optional and not required for basic functionality.
echo.
echo To start the API server, run: python app.py
pause
