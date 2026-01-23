@echo off
REM Quick setup script for Ollama on Windows
REM This script checks if Ollama is running and pulls the mistral model

echo ====================================
echo  Ollama Setup for Interview Platform
echo ====================================
echo.

REM Check if Ollama is running
echo Checking if Ollama is running...
curl.exe http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Ollama is not running!
    echo.
    echo Please start Ollama:
    echo 1. Open the Ollama application (search "Ollama" in Start menu)
    echo 2. Let it start (it runs in the background)
    echo 3. Come back here and run this script again
    echo.
    pause
    exit /b 1
)

echo [OK] Ollama is running on localhost:11434
echo.

REM Check if mistral model exists
echo Checking for mistral model...
ollama list | find "mistral" >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Mistral model not found. Downloading (~5GB, 5-10 minutes)...
    echo.
    ollama pull mistral
    if %errorlevel% neq 0 (
        echo.
        echo ERROR: Failed to pull mistral model
        echo Make sure Ollama is running and you have internet connection
        echo.
        pause
        exit /b 1
    )
) else (
    echo [OK] Mistral model is already installed
)

echo.
echo ====================================
echo  Setup Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Run: npm run dev
echo 2. Open http://localhost:3000
echo 3. Start the interview - questions will be generated using local Ollama
echo.
pause
