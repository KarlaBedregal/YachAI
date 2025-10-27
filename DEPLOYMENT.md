# YachAI - Deployment Guide

## 🚀 Opciones de Deployment

### Opción 1: Vercel (Frontend) + Render (Backend)

#### Frontend en Vercel

1. **Preparar el proyecto:**
```bash
cd frontend
npm run build
```

2. **Subir a GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

3. **Deploy en Vercel:**
- Ve a [vercel.com](https://vercel.com)
- Import tu repositorio
- Configura:
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`

4. **Variables de entorno en Vercel:**
```env
VITE_API_URL=https://tu-backend.onrender.com
VITE_SUPABASE_URL=tu-supabase-url
VITE_SUPABASE_ANON_KEY=tu-supabase-key
```

#### Backend en Render

1. **Crear `Procfile` en backend:**
```
web: gunicorn app:app
```

2. **Deploy en Render:**
- Ve a [render.com](https://render.com)
- New > Web Service
- Conecta tu repositorio
- Configura:
  - Build Command: `pip install -r requirements.txt`
  - Start Command: `gunicorn app:app`

3. **Variables de entorno en Render:**
```env
FLASK_ENV=production
DEBUG=False
SECRET_KEY=tu-secret-key-segura
SUPABASE_URL=tu-supabase-url
SUPABASE_KEY=tu-supabase-key
GROQ_API_KEY=tu-groq-key
CORS_ORIGINS=https://tu-frontend.vercel.app
```

### Opción 2: Railway (Full Stack)

1. **Deploy en Railway:**
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Crear proyecto
railway init

# Deploy backend
cd backend
railway up

# Deploy frontend
cd ../frontend
railway up
```

2. **Configurar variables de entorno en Railway dashboard**

### Opción 3: DigitalOcean App Platform

1. **Crear `app.yaml`:**
```yaml
name: yachai
services:
  - name: backend
    source:
      repo: your-repo
      branch: main
      context: backend
    build_command: pip install -r requirements.txt
    run_command: gunicorn app:app
    envs:
      - key: GROQ_API_KEY
        value: ${GROQ_API_KEY}
      - key: SUPABASE_URL
        value: ${SUPABASE_URL}
      - key: SUPABASE_KEY
        value: ${SUPABASE_KEY}
  
  - name: frontend
    source:
      repo: your-repo
      branch: main
      context: frontend
    build_command: npm install && npm run build
    static_sites:
      - location: /dist
```

## 🔒 Seguridad en Producción

### Backend

1. **Actualizar `config.py`:**
```python
# Usar variables de entorno seguras
SECRET_KEY = os.getenv('SECRET_KEY')  # Generar una nueva
DEBUG = False
FLASK_ENV = 'production'
```

2. **Configurar CORS adecuadamente:**
```python
CORS_ORIGINS = os.getenv('CORS_ORIGINS', '').split(',')
```

3. **Usar HTTPS:**
- Vercel/Render proveen HTTPS automáticamente

### Frontend

1. **Asegurar variables de entorno:**
- Solo usar `VITE_` prefix para variables públicas
- Nunca exponer API keys privadas en el frontend

### Supabase

1. **Configurar políticas de seguridad (RLS):**
- Ya están configuradas en `schema.sql`
- Revisar que sean apropiadas para producción

2. **Configurar autenticación:**
- Para producción, considera usar Supabase Auth
- Actualizar políticas según necesites

## 📊 Monitoreo

### Backend

1. **Logs en Render/Railway:**
```bash
# Ver logs en tiempo real
railway logs
```

2. **Health Check:**
```bash
curl https://tu-backend.com/health
```

### Frontend

1. **Analytics:**
- Agregar Google Analytics
- Vercel Analytics (automático)

## 🎯 Checklist Pre-Deployment

- [ ] Variables de entorno configuradas
- [ ] Base de datos Supabase lista
- [ ] API de Groq funcionando
- [ ] Build del frontend exitoso
- [ ] Tests básicos pasando
- [ ] CORS configurado correctamente
- [ ] HTTPS habilitado
- [ ] Logs funcionando
- [ ] Health checks configurados

## 💰 Costos Estimados (Tier Gratuito)

- **Vercel:** Gratis (100GB bandwidth)
- **Render:** Gratis (750 horas/mes)
- **Supabase:** Gratis (500MB database, 1GB bandwidth)
- **Groq:** Gratis (rate limits aplicables)

**Total:** $0/mes con tiers gratuitos

## 🔄 CI/CD (Opcional)

### GitHub Actions

Crear `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd frontend && npm install && npm run build
      
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
      - run: cd backend && pip install -r requirements.txt
```

## 📝 Mantenimiento

1. **Actualizar dependencias:**
```bash
# Backend
pip list --outdated
pip install -U package-name

# Frontend
npm outdated
npm update
```

2. **Backups de Supabase:**
- Configurar backups automáticos en dashboard
- Exportar datos periódicamente

3. **Monitorear uso de APIs:**
- Groq: revisar rate limits
- Supabase: revisar uso de storage y bandwidth

---

**¡Tu aplicación YachAI está lista para el mundo! 🌍🚀**
