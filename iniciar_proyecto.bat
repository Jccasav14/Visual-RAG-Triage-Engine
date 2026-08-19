@echo off
title Visual RAG - Lanzador Universal del Sistema
color 0A

echo ===================================================================
echo               VISUAL RAG - INICIALIZADOR COMPLETO
echo ===================================================================
echo.
echo Iniciando todos los microservicios y aplicaciones del monorepo...
echo.

:: 1. Iniciar Microservicio de Vision AI (Python FastAPI - Puerto 8000)
echo [1/4] Iniciando Vision AI Worker (Python en puerto 8000)...
start "Visual RAG - 1. Vision AI Worker (Python: 8000)" cmd /k "cd /d "%~dp0backend\apps\vision-ai-worker" && python main.py"

:: 2. Iniciar Microservicios Backend (NestJS - Puertos 3001, 3002, 3003, 3050)
echo [2/4] Iniciando Microservicios NestJS (Identity:3001, Triage:3002, LLM:3003, Gateway:3050)...
start "Visual RAG - 2. Microservicios Backend (NestJS)" cmd /k "cd /d "%~dp0backend" && npm run start:all"

:: 3. Iniciar Aplicacion Mobile (Expo React Native - Puerto 8081)
echo [3/4] Iniciando Aplicacion Mobile (Expo Go en puerto 8081)...
start "Visual RAG - 3. App Mobile (Expo React Native)" cmd /k "cd /d "%~dp0mobile" && npm start"

:: 4. Iniciar Frontend Web (React Vite - Puerto 5173)
echo [4/4] Iniciando Frontend Web (React Vite)...
start "Visual RAG - 4. Frontend Web (React Vite)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ===================================================================
echo     TODOS LOS SERVICIOS HAN SIDO LANZADOS EXITOSAMENTE!
echo ===================================================================
echo.
echo - Vision Worker:  http://localhost:8000
echo - Identity DB:    http://localhost:3001
echo - Triage DB:      http://localhost:3002
echo - LLM Service:    http://localhost:3003
echo - API Gateway:    http://localhost:3050
echo - Web Frontend:   http://localhost:5173
echo - Expo Mobile:    http://localhost:8081  (En celular: exp://192.168.3.121:8081)
echo.
echo Puedes minimizar esta ventana. Para apagar todo, solo cierra las terminales.
echo ===================================================================
pause
