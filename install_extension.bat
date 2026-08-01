@echo off
echo ============================================================
echo   Installing Adobe Extensions (One-Shot Automated Setup)
echo ============================================================
powershell -ExecutionPolicy Bypass -File "%~dp0install_extension.ps1"
pause
