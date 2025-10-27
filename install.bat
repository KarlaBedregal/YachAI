@echo off
REM YachAI - Script de Instalación para Windows

echo ==========================================
echo    YachAI - Instalacion Automatica
echo ==========================================
echo.

echo Verificando requisitos...

REM Verificar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python no esta instalado
    pause
    exit /b 1
)
echo [OK] Python encontrado

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no esta instalado
    pause
    exit /b 1
)
echo [OK] Node.js encontrado

echo.
echo Configurando Backend...
cd backend

REM Crear entorno virtual
if not exist "venv" (
    python -m venv venv
    echo [OK] Entorno virtual creado
) else (
    echo [AVISO] Entorno virtual ya existe
)

REM Activar entorno virtual e instalar
call venv\Scripts\activate
pip install -r requirements.txt >nul 2>&1
echo [OK] Dependencias de Python instaladas

REM Copiar .env
if not exist ".env" (
    copy .env.example .env >nul
    echo [AVISO] Archivo .env creado - CONFIGURA TUS CREDENCIALES
) else (
    echo [AVISO] Archivo .env ya existe
)

cd ..

echo.
echo Configurando Frontend...
cd frontend

REM Instalar dependencias
call npm install >nul 2>&1
echo [OK] Dependencias de Node.js instaladas

REM Copiar .env
if not exist ".env" (
    copy .env.example .env >nul
    echo [AVISO] Archivo .env creado - CONFIGURA TUS CREDENCIALES
) else (
    echo [AVISO] Archivo .env ya existe
)

cd ..

echo.
echo ==========================================
echo    Instalacion Completada!
echo ==========================================
echo.
echo PROXIMOS PASOS:
echo.
echo 1. Configurar Supabase (https://supabase.com)
echo 2. Configurar Groq API (https://console.groq.com)
echo 3. Editar backend\.env y frontend\.env
echo 4. Ejecutar:
echo    - Terminal 1: cd backend ^&^& venv\Scripts\activate ^&^& python app.py
echo    - Terminal 2: cd frontend ^&^& npm run dev
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause
