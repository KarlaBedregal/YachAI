# 🎮 YachAI - Aprendizaje Gamificado con IA

**YachAI** es una plataforma educativa que convierte cualquier tema en minijuegos personalizados usando inteligencia artificial. Los estudiantes aprenden jugando con contenidos adaptados a su nivel, idioma y contexto local peruano.

![YachAI Banner](https://via.placeholder.com/1200x300/9333ea/ffffff?text=YachAI+-+Aprende+Jugando+con+IA)

## 🌟 Características Principales

### 🎯 Tres Tipos de Minijuegos

1. **🧩 Trivia** - Preguntas de opción múltiple con explicaciones
2. **🏕️ Aventura** - Historias interactivas con decisiones que afectan el resultado
3. **🛒 Mercadito** - Simulaciones prácticas con misiones educativas

### 🤖 Generación de Contenido con IA

- Usa **Groq API** (gratis y rápida) con modelos Llama 3.1
- Genera preguntas, historias y misiones personalizadas
- Feedback educativo inteligente
- Adaptación al contexto local peruano

### 🧠 Análisis de Inteligencias Múltiples

- Evalúa el perfil de inteligencias del estudiante:
  - 📚 Lingüística
  - 🔢 Lógico-Matemática
  - 🎨 Espacial
  - 🌿 Naturalista
  - 👥 Interpersonal

### 📊 Sistema de Progreso

- Puntajes y niveles
- Ranking global
- Historial de juegos
- Logros y medallas
- Dashboard personalizado

## 🏗️ Arquitectura del Proyecto

```
YachAI/
├── backend/                    # Flask API
│   ├── app.py                 # Aplicación principal
│   ├── config.py              # Configuración
│   ├── requirements.txt       # Dependencias Python
│   ├── models/                # Modelos de datos (Pydantic)
│   │   ├── user.py
│   │   └── game.py
│   ├── routes/                # Endpoints API
│   │   ├── user_routes.py
│   │   ├── ai_routes.py
│   │   └── game_routes.py
│   └── services/              # Lógica de negocio
│       ├── ai_service.py      # Integración con Groq
│       └── supabase_service.py # Base de datos
│
├── frontend/                  # React + Vite
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── components/        # Componentes reutilizables
│       │   ├── AvatarSelector.jsx
│       │   ├── TriviaGame.jsx
│       │   ├── AdventureGame.jsx
│       │   ├── MarketGame.jsx
│       │   ├── GameSelector.jsx
│       │   └── GameResult.jsx
│       ├── pages/             # Páginas principales
│       │   ├── Home.jsx
│       │   ├── Dashboard.jsx
│       │   └── GameSession.jsx
│       ├── services/          # APIs y servicios
│       │   ├── api.js
│       │   └── supabaseClient.js
│       ├── store/             # Estado global (Zustand)
│       │   ├── userStore.js
│       │   └── gameStore.js
│       ├── utils/             # Utilidades
│       │   ├── constants.js
│       │   └── helpers.js
│       └── styles/
│           └── globals.css
│
└── database/
    └── schema.sql             # Schema de Supabase

```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Python 3.8+
- Node.js 18+
- Cuenta en [Supabase](https://supabase.com) (gratis)
- API Key de [Groq](https://console.groq.com) (gratis)

### 1. Configurar Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

**Archivo `.env` del backend:**
```env
FLASK_ENV=development
DEBUG=True
SECRET_KEY=tu-clave-secreta

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-anon-key

# Groq API
GROQ_API_KEY=tu-groq-api-key

CORS_ORIGINS=http://localhost:5173
```

### 2. Configurar Base de Datos (Supabase)

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve a **SQL Editor**
3. Ejecuta el script `database/schema.sql`
4. Copia tu URL y Anon Key desde **Settings > API**

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

**Archivo `.env` del frontend:**
```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### 4. Obtener API Key de Groq (GRATIS)

1. Ve a [console.groq.com](https://console.groq.com)
2. Regístrate gratis
3. Crea una API Key
4. Cópiala en tu `.env` del backend

## ▶️ Ejecutar el Proyecto

### Backend (Terminal 1)

```bash
cd backend
source venv/bin/activate  # Activar entorno virtual
python app.py
```

El backend correrá en `http://localhost:5000`

### Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

El frontend correrá en `http://localhost:5173`

## 🎮 Flujo de Uso

1. **Registro** → El usuario elige nombre y avatar
2. **Tema** → Escribe un tema educativo o elige uno sugerido
3. **Tipo de juego** → Selecciona Trivia, Aventura o Mercadito
4. **Generación IA** → La IA crea el contenido personalizado
5. **Jugar** → Completa el minijuego
6. **Resultados** → Ve puntaje, feedback y análisis de inteligencias
7. **Dashboard** → Revisa progreso, ranking y logros

## 🔧 Tecnologías Utilizadas

### Backend
- **Flask** - Framework web Python
- **Groq API** - IA generativa (Llama 3.1) GRATIS
- **Supabase** - Base de datos PostgreSQL
- **Pydantic** - Validación de datos

### Frontend
- **React 18** - UI Library
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Framer Motion** - Animaciones
- **Zustand** - Estado global
- **Axios** - HTTP client
- **React Router** - Navegación

## 📚 API Endpoints

### Usuarios
- `POST /api/users/register` - Crear usuario
- `GET /api/users/:id` - Obtener usuario
- `GET /api/users/:id/statistics` - Estadísticas
- `GET /api/users/leaderboard` - Ranking

### Juegos
- `POST /api/games/start` - Iniciar juego
- `GET /api/games/:sessionId` - Obtener sesión
- `POST /api/games/:sessionId/submit` - Enviar respuestas

### IA
- `POST /api/ai/generate-content` - Generar contenido
- `POST /api/ai/generate-feedback` - Generar feedback
- `POST /api/ai/analyze-intelligence` - Analizar inteligencias

## 🎯 Adaptación al Contexto Local

YachAI está adaptado al contexto peruano:

- 🦙 Usa ejemplos de animales, lugares y cultura peruana
- 🏛️ Temas históricos locales (Cultura Inca, Independencia del Perú)
- 🛒 El "Mercadito" simula mercados peruanos
- 💰 Moneda local (soles)
- 🗣️ Lenguaje adaptado para niños peruanos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT.

## 👨‍💻 Autor

Creado con ❤️ para el Hackatón de Educación con IA

## 🔮 Futuras Mejoras

- [ ] Más tipos de juegos (Puzzle, Memoria, etc.)
- [ ] Generación de imágenes con IA
- [ ] Modo multijugador
- [ ] Personalización de dificultad automática
- [ ] Reportes para padres/profesores
- [ ] App móvil
- [ ] Soporte para más idiomas

---

**¡Aprende jugando con YachAI! 🎮🚀**
