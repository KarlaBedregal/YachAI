#!/bin/bash

# 🎮 YachAI - Script de Instalación Rápida
# Este script configura todo el proyecto automáticamente

echo "🎮 =========================================="
echo "   YachAI - Instalación Automática"
echo "=========================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para mensajes
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Verificar requisitos
echo "📋 Verificando requisitos..."

# Verificar Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 no está instalado"
    exit 1
fi
print_success "Python 3 encontrado"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    exit 1
fi
print_success "Node.js encontrado"

# Verificar npm
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi
print_success "npm encontrado"

echo ""
echo "🔧 Configurando Backend..."
cd backend

# Crear entorno virtual
if [ ! -d "venv" ]; then
    python3 -m venv venv
    print_success "Entorno virtual creado"
else
    print_warning "Entorno virtual ya existe"
fi

# Activar entorno virtual
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt > /dev/null 2>&1
print_success "Dependencias de Python instaladas"

# Copiar .env si no existe
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_warning "Archivo .env creado. ¡DEBES CONFIGURAR TUS CREDENCIALES!"
else
    print_warning "Archivo .env ya existe"
fi

cd ..

echo ""
echo "🎨 Configurando Frontend..."
cd frontend

# Instalar dependencias
npm install > /dev/null 2>&1
print_success "Dependencias de Node.js instaladas"

# Copiar .env si no existe
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_warning "Archivo .env creado. ¡DEBES CONFIGURAR TUS CREDENCIALES!"
else
    print_warning "Archivo .env ya existe"
fi

cd ..

echo ""
echo "✅ =========================================="
echo "   ¡Instalación Completada!"
echo "=========================================="
echo ""
echo "📝 PRÓXIMOS PASOS:"
echo ""
echo "1️⃣  Configurar Supabase:"
echo "   - Ve a https://supabase.com y crea un proyecto"
echo "   - Ejecuta el script database/schema.sql"
echo "   - Copia tus credenciales"
echo ""
echo "2️⃣  Configurar Groq API (GRATIS):"
echo "   - Ve a https://console.groq.com"
echo "   - Crea una cuenta y obtén tu API Key"
echo ""
echo "3️⃣  Editar archivos .env:"
echo "   - backend/.env"
echo "   - frontend/.env"
echo ""
echo "4️⃣  Ejecutar el proyecto:"
echo "   Terminal 1: cd backend && source venv/bin/activate && python app.py"
echo "   Terminal 2: cd frontend && npm run dev"
echo ""
echo "🚀 Backend: http://localhost:5000"
echo "🎨 Frontend: http://localhost:5173"
echo ""
print_success "¡Listo para empezar! 🎮"
