@echo off
echo Starting HireMate AI...

:: Start Spring Boot Backend in a separate window
echo Starting backend server on http://localhost:8080...
start "HireMate AI - Backend" cmd /c "cd backend && mvn spring-boot:run"

:: Start React Frontend in a separate window
echo Starting frontend dev server on http://localhost:5173...
start "HireMate AI - Frontend" cmd /c "cd frontend && npm run dev"

echo HireMate AI is launching! Please wait a moment for the build steps to complete.
echo The app will be available at http://localhost:5173
echo Press any key to exit this launcher window (keeps the backend and frontend running).
pause > nul
