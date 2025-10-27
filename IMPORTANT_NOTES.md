# 📝 YachAI - Notas Importantes

## ⚠️ Antes de Ejecutar

### 1. Obtener Credenciales (TODO)

#### Supabase (Base de Datos)
- [ ] Crear cuenta en https://supabase.com
- [ ] Crear nuevo proyecto
- [ ] Ir a SQL Editor y ejecutar `database/schema.sql`
- [ ] Copiar desde Settings > API:
  - `Project URL` → Variable `SUPABASE_URL`
  - `anon/public key` → Variable `SUPABASE_KEY`

#### Groq (IA Generativa - GRATIS)
- [ ] Crear cuenta en https://console.groq.com
- [ ] Ir a API Keys
- [ ] Crear nueva API Key
- [ ] Copiar → Variable `GROQ_API_KEY`

### 2. Configurar Variables de Entorno

**Backend** (`backend/.env`):
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🎯 Características Principales

### ✅ Lo que SÍ está implementado

1. **Sistema completo de usuarios**
   - Registro con avatar
   - Login por username
   - Sistema de niveles y puntos
   - Perfil personalizado

2. **Tres tipos de juegos funcionales**
   - 🧩 Trivia: Preguntas de opción múltiple
   - 🏕️ Aventura: Historias interactivas
   - 🛒 Mercadito: Misiones educativas

3. **IA Generativa (Groq/Llama 3.1)**
   - Genera preguntas personalizadas
   - Crea historias educativas
   - Diseña misiones del mercadito
   - Feedback inteligente
   - **Adaptado al contexto peruano**

4. **Sistema de progreso completo**
   - Dashboard con estadísticas
   - Ranking global
   - Historial de juegos
   - Sistema de logros
   - Análisis de inteligencias múltiples

5. **Base de datos Supabase**
   - 5 tablas relacionales
   - Políticas de seguridad
   - Almacenamiento de progreso

### ⚠️ Lo que NO está implementado (pero se puede agregar)

1. **Autenticación con email/password**
   - Actualmente: Solo username (más simple para demo)
   - Para agregar: Usar Supabase Auth

2. **Imágenes generadas por IA**
   - Actualmente: Emojis para avatares y juegos
   - Para agregar: Integrar DALL-E o Stable Diffusion

3. **Modo multijugador**
   - Actualmente: Individual
   - Para agregar: WebSockets con Socket.io

4. **App móvil**
   - Actualmente: Solo web responsive
   - Para agregar: React Native o Capacitor

## 🔧 Configuración Técnica

### Versiones Requeridas
- Python: 3.8+
- Node.js: 18+
- npm: 9+

### Puertos Usados
- Backend: 5000
- Frontend: 5173

### APIs Usadas
1. **Groq** (IA)
   - Modelo: llama-3.1-70b-versatile
   - Gratis con rate limits
   - Muy rápido

2. **Supabase** (BD)
   - PostgreSQL
   - Tier gratuito: 500MB
   - Row Level Security habilitado

## 🎨 Personalización

### Cambiar Avatares
Editar `frontend/src/utils/constants.js`:
```javascript
export const AVATARS = [
  { id: 'new_avatar', name: 'Nuevo', emoji: '🐸' },
  // Agregar más...
];
```

### Agregar Temas Sugeridos
Editar `frontend/src/utils/constants.js`:
```javascript
export const SUGGESTED_TOPICS = [
  { id: 9, title: 'Nuevo Tema', category: 'Categoría', emoji: '📖' },
  // Agregar más...
];
```

### Cambiar Colores
Editar `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      'primary': '#9333ea', // Purple
      'secondary': '#ec4899', // Pink
    }
  }
}
```

### Ajustar Dificultad de Juegos
Editar `backend/config.py`:
```python
TRIVIA_QUESTIONS_COUNT = 5  # Cambiar cantidad de preguntas
ADVENTURE_CHOICES_COUNT = 3  # Opciones por escena
MARKET_MISSIONS_COUNT = 3    # Misiones del mercadito
```

## 🐛 Problemas Comunes

### "groq.APIConnectionError"
**Causa:** API Key de Groq inválida o falta configurar
**Solución:** Verifica `GROQ_API_KEY` en `backend/.env`

### "supabase.exceptions.APIError"
**Causa:** Credenciales de Supabase incorrectas
**Solución:** Verifica `SUPABASE_URL` y `SUPABASE_KEY`

### "ModuleNotFoundError: No module named 'flask'"
**Causa:** Dependencias no instaladas o entorno virtual no activado
**Solución:**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### "Cannot find module 'react'"
**Causa:** Dependencias de Node no instaladas
**Solución:**
```bash
cd frontend
npm install
```

### CORS Error en frontend
**Causa:** Backend no está corriendo o CORS mal configurado
**Solución:** Verifica que backend esté en puerto 5000

### Puerto ocupado
**Solución:**
```bash
# Cambiar puerto en app.py o vite.config.js
# O matar proceso:
lsof -ti:5000 | xargs kill -9
```

## 📊 Estructura de Base de Datos

```
users (id, username, avatar, total_score, level, created_at)
  ↓
game_sessions (id, user_id, topic, game_type, content, score, completed)
  ↓
game_results (id, session_id, user_id, score, feedback, intelligence_analysis)
  ↓
user_statistics (user_id, games_played, linguistic_score, etc.)
  ↓
achievements (user_id, achievement_type, title, earned_at)
```

## 🚀 Optimizaciones Futuras

1. **Performance:**
   - Cache de respuestas de IA
   - Lazy loading de componentes
   - Optimización de imágenes

2. **Features:**
   - Sistema de amigos
   - Chat entre jugadores
   - Torneos y desafíos
   - Badges personalizados
   - Temas personalizados por el profesor

3. **UX:**
   - Tutorial interactivo
   - Modo oscuro
   - Sonidos y música
   - Animaciones mejoradas

## 📱 Responsive Design

- ✅ Desktop (1920x1080+)
- ✅ Laptop (1366x768+)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667+)

## 🔒 Seguridad

### En Desarrollo
- CORS abierto a localhost
- DEBUG = True
- No hay autenticación estricta

### En Producción
- [ ] CORS restringido a dominios específicos
- [ ] DEBUG = False
- [ ] HTTPS obligatorio
- [ ] Variables de entorno seguras
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] SQL injection prevention (Supabase lo maneja)

## 📚 Recursos Útiles

- **Groq Docs:** https://console.groq.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Framer Motion:** https://www.framer.com/motion

## 💡 Tips para el Hackatón

1. **Demo efectiva:**
   - Preparar 2-3 temas interesantes
   - Mostrar los 3 tipos de juegos
   - Destacar el análisis de inteligencias
   - Mostrar el ranking

2. **Pitch:**
   - Enfatizar el contexto local peruano
   - Mostrar la personalización con IA
   - Explicar las inteligencias múltiples
   - Demostrar que es 100% funcional

3. **Diferenciadores:**
   - IA generativa (no contenido pre-programado)
   - 3 tipos de aprendizaje diferentes
   - Análisis de perfil del estudiante
   - Adaptado a Perú
   - 100% gratuito

## ✅ Checklist Final

Antes de presentar/deployar:

- [ ] Todas las credenciales configuradas
- [ ] Schema de BD ejecutado
- [ ] Backend corriendo sin errores
- [ ] Frontend corriendo sin errores
- [ ] Probar registro de usuario
- [ ] Probar cada tipo de juego
- [ ] Verificar dashboard y estadísticas
- [ ] Verificar ranking
- [ ] Probar en diferentes navegadores
- [ ] Responsive en móvil funciona

---

**¡YachAI está listo! 🎮🚀**

*Si tienes dudas, revisa:*
- `README.md` - Documentación principal
- `QUICKSTART.md` - Inicio rápido
- `API_DOCUMENTATION.md` - Docs de API
- `DEPLOYMENT.md` - Guía de deployment
