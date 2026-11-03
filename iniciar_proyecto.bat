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
echo [1/5] Iniciando Vision AI Worker (Python en puerto 8000)...
start "Visual RAG - 1. Vision AI Worker (Python: 8000)" cmd /k "cd /d "%~dp0backend\apps\vision-ai-worker" && python main.py"

:: 2. Iniciar Microservicio de Farmacias & Auditoria Benford (Python FastAPI - Puerto 8005)
echo [2/5] Iniciando Pharmacy Scraper & Benford Engine (Python en puerto 8005)...
start "Visual RAG - 2. Pharmacy Scraper & Benford (Python: 8005)" cmd /k "cd /d "%~dp0backend\apps\pharmacy-scraper-service" && python main.py"

:: 3. Iniciar Microservicios Backend (NestJS - Puertos 3001, 3002, 3003, 3050)
echo [3/5] Iniciando Microservicios NestJS (Identity:3001, Triage:3002, LLM:3003, Gateway:3050)...
start "Visual RAG - 3. Microservicios Backend (NestJS)" cmd /k "cd /d "%~dp0backend" && npm run start:all"

:: 4. Iniciar Aplicacion Mobile (Expo React Native - Puerto 8081)
echo [4/5] Iniciando Aplicacion Mobile (Expo Go en puerto 8081)...
start "Visual RAG - 4. App Mobile (Expo React Native)" cmd /k "cd /d "%~dp0mobile" && npm start"

:: 5. Iniciar Frontend Web (React Vite - Puerto 5173)
echo [5/5] Iniciando Frontend Web (React Vite)...
start "Visual RAG - 5. Frontend Web (React Vite)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ===================================================================
echo     TODOS LOS SERVICIOS HAN SIDO LANZADOS EXITOSAMENTE!
echo ===================================================================
echo.
echo - Vision Worker:     http://localhost:8000/docs
echo - Pharmacy & Benford: http://localhost:8005/docs
echo - Identity DB:       http://localhost:3001
echo - Triage DB:         http://localhost:3002
echo - LLM Service:       http://localhost:3003
echo - API Gateway:       http://localhost:3050/api
echo - Web Frontend:      http://localhost:5173
echo - Expo Mobile:       http://localhost:8081  (En celular: exp://192.168.3.121:8081)
echo.
echo Puedes minimizar esta ventana. Para apagar todo, solo cierra las terminales.
echo ===================================================================
pause
