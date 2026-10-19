@echo off
setlocal
cd /d "%~dp0"
title Dunamis Life Ministries V6

echo ================================================
echo   DUNAMIS LIFE MINISTRIES - LIVE STREAMING V6
echo ================================================
echo.
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is not installed. Opening the official download page...
  start "" "https://nodejs.org/en/download"
  pause
  exit /b 1
)

if not exist ".env" (
  copy ".env.example" ".env" >nul
  echo FIRST SETUP REQUIRED:
  echo A .env file has been created.
  echo Open it in Notepad and add your LiveKit URL, API key and API secret.
  echo Then run this file again.
  echo.
  notepad ".env"
  pause
  exit /b 0
)

findstr /C:"YOUR-PROJECT" ".env" >nul
if not errorlevel 1 (
  echo LiveKit credentials have not been added yet.
  echo Opening .env now. Paste your project URL, API key and API secret, save, then run again.
  notepad ".env"
  pause
  exit /b 0
)

if not exist "node_modules" (
  echo Installing V6 streaming dependencies...
  call npm install
  if errorlevel 1 (echo Installation failed.& pause & exit /b 1)
)

echo Starting token server and Dunamis app...
echo Keep this window open while using the app.
call npm start
endlocal
