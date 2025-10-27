# YachAI - Guía de Inicio Rápido

## 🚀 Instalación en 5 minutos

### Opción 1: Script Automático (Linux/Mac)

```bash
chmod +x install.sh
./install.sh
```

### Opción 2: Script Automático (Windows)

```cmd
install.bat
```

### Opción 3: Manual

Ver `README.md` para instrucciones detalladas.

## 🔑 Obtener Credenciales

### 1. Supabase (Base de Datos - GRATIS)

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta y un nuevo proyecto
3. Ve a **SQL Editor** y ejecuta `database/schema.sql`
4. Ve a **Settings > API**
5. Copia:
   - `Project URL` → `SUPABASE_URL`
   - `anon/public key` → `SUPABASE_KEY`

### 2. Groq (IA Generativa - GRATIS)

1. Ve a [console.groq.com](https://console.groq.com)
2. Crea una cuenta gratuita
3. Ve a **API Keys**
4. Crea una nueva key
5. Cópiala → `GROQ_API_KEY`

## ⚙️ Configurar Variables de Entorno

### Backend (`backend/.env`)

```env
FLASK_ENV=development
DEBUG=True
SECRET_KEY=cambia-esto-en-produccion

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-anon-key-aqui

# Groq API
GROQ_API_KEY=tu-groq-key-aqui

CORS_ORIGINS=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

## ▶️ Ejecutar el Proyecto

### Terminal 1 - Backend

```bash
cd backend
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate     # Windows

python app.py
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

## 🌐 Acceder a la Aplicación

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## 🐛 Solución de Problemas

### Error: "Module not found"

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Error: "Connection refused" en Supabase

- Verifica que `SUPABASE_URL` y `SUPABASE_KEY` sean correctos
- Ejecuta el script `database/schema.sql` en Supabase

### Error: IA no genera contenido

- Verifica que `GROQ_API_KEY` sea válido
- Revisa que tengas créditos en tu cuenta Groq (son gratis)

### Puerto 5000 o 5173 ocupado

```bash
# Cambiar puerto del backend (app.py)
app.run(port=5001)

# Cambiar puerto del frontend (vite.config.js)
server: { port: 5174 }
```

## 📞 Soporte

Si tienes problemas, revisa:

1. `README.md` - Documentación completa
2. Logs de consola (errores)
3. Variables de entorno configuradas

## ✅ Checklist de Instalación

- [ ] Python 3.8+ instalado
- [ ] Node.js 18+ instalado
- [ ] Dependencias del backend instaladas
- [ ] Dependencias del frontend instaladas
- [ ] Proyecto Supabase creado
- [ ] Schema SQL ejecutado en Supabase
- [ ] API Key de Groq obtenida
- [ ] Archivo `backend/.env` configurado
- [ ] Archivo `frontend/.env` configurado
- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo en puerto 5173

¡Listo para aprender jugando! 🎮
