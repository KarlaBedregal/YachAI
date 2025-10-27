# 🔌 YachAI - API Documentation

## Base URL
```
Development: http://localhost:5000
Production: https://your-backend.com
```

## 📋 Table of Contents
1. [Users](#users)
2. [Games](#games)
3. [AI](#ai)
4. [Examples](#examples)

---

## Users

### POST `/api/users/register`
Registra un nuevo usuario.

**Request:**
```json
{
  "username": "Aventurero",
  "avatar": "lion",
  "email": "opcional@email.com"
}
```

**Response (201):**
```json
{
  "message": "Usuario creado exitosamente",
  "user": {
    "id": "uuid-here",
    "username": "Aventurero",
    "avatar": "lion",
    "total_score": 0,
    "level": 1,
    "created_at": "2024-01-01T00:00:00"
  }
}
```

### GET `/api/users/:userId`
Obtiene información de un usuario.

**Response (200):**
```json
{
  "id": "uuid",
  "username": "Aventurero",
  "avatar": "lion",
  "total_score": 250,
  "level": 3,
  "created_at": "2024-01-01T00:00:00"
}
```

### GET `/api/users/username/:username`
Busca un usuario por nombre.

### GET `/api/users/:userId/statistics`
Obtiene estadísticas del usuario.

**Response (200):**
```json
{
  "user_id": "uuid",
  "games_played": 15,
  "topics_completed": 8,
  "trivia_count": 7,
  "adventure_count": 5,
  "market_count": 3,
  "linguistic_score": 120,
  "logical_mathematical_score": 180,
  "spatial_score": 90,
  "naturalistic_score": 110,
  "interpersonal_score": 150
}
```

### GET `/api/users/:userId/achievements`
Lista los logros del usuario.

### GET `/api/users/leaderboard?limit=10`
Obtiene el ranking global.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "username": "Campeon",
    "avatar": "dragon",
    "total_score": 500,
    "level": 5
  }
]
```

---

## Games

### POST `/api/games/start`
Inicia una nueva sesión de juego.

**Request:**
```json
{
  "user_id": "user-uuid",
  "topic": "El ciclo del agua",
  "game_type": "trivia",
  "difficulty": "medium",
  "age_range": "8-14"
}
```

**Response (201):**
```json
{
  "message": "Sesión de juego creada",
  "session": {
    "id": "session-uuid",
    "user_id": "user-uuid",
    "topic": "El ciclo del agua",
    "game_type": "trivia",
    "content": {
      "topic": "El ciclo del agua",
      "game_type": "trivia",
      "trivia_questions": [
        {
          "question": "¿Qué es la evaporación?",
          "options": [
            "Cuando el agua se convierte en vapor",
            "Cuando llueve",
            "Cuando el agua se congela",
            "Cuando el agua corre"
          ],
          "correct_answer": 0,
          "explanation": "La evaporación es cuando...",
          "intelligence_type": "naturalistic"
        }
      ]
    },
    "score": 0,
    "completed": false,
    "started_at": "2024-01-01T00:00:00"
  }
}
```

### GET `/api/games/:sessionId`
Obtiene una sesión de juego.

### POST `/api/games/:sessionId/submit`
Envía las respuestas y completa el juego.

**Request:**
```json
{
  "answers": [
    {
      "question_index": 0,
      "selected_answer": 0,
      "is_correct": true,
      "points": 10
    }
  ]
}
```

**Response (200):**
```json
{
  "message": "Juego completado",
  "result": {
    "session_id": "session-uuid",
    "user_id": "user-uuid",
    "topic": "El ciclo del agua",
    "game_type": "trivia",
    "score": 40,
    "max_score": 50,
    "percentage": 80,
    "feedback": "¡Muy bien! Dominas el tema...",
    "intelligence_analysis": {
      "naturalistic": 30,
      "logical_mathematical": 10
    },
    "recommendations": [
      "¡Excelente! Dominas El ciclo del agua",
      "Explora temas relacionados"
    ]
  }
}
```

---

## AI

### POST `/api/ai/generate-content`
Genera contenido para un juego (usado internamente por `/api/games/start`).

**Request:**
```json
{
  "topic": "Animales del Perú",
  "game_type": "adventure",
  "difficulty": "easy",
  "age_range": "8-14"
}
```

**Response (200):**
```json
{
  "message": "Contenido generado exitosamente",
  "content": {
    "topic": "Animales del Perú",
    "game_type": "adventure",
    "adventure_story": {
      "title": "La Aventura en los Andes",
      "introduction": "Eres un explorador...",
      "scenes": [...]
    }
  }
}
```

### POST `/api/ai/generate-feedback`
Genera feedback personalizado.

**Request:**
```json
{
  "topic": "Matemáticas",
  "score": 30,
  "max_score": 50,
  "game_type": "trivia",
  "answers": []
}
```

**Response (200):**
```json
{
  "feedback": "¡Buen trabajo! 🎉 Obtuviste 30 de 50 puntos..."
}
```

### POST `/api/ai/analyze-intelligence`
Analiza el perfil de inteligencias múltiples.

**Request:**
```json
{
  "user_id": "user-uuid"
}
```

**Response (200):**
```json
{
  "message": "Análisis completado",
  "profile": {
    "scores": {
      "linguistic": 120,
      "logical_mathematical": 180,
      "spatial": 90,
      "naturalistic": 110,
      "interpersonal": 150
    },
    "strongest": "logical_mathematical",
    "strongest_name": "Lógico-Matemática",
    "profile_description": "¡Tienes mente de científico!..."
  }
}
```

---

## Examples

### Ejemplo completo: Flujo de juego

```javascript
// 1. Registrar usuario
const user = await fetch('http://localhost:5000/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'MiUsuario',
    avatar: 'lion'
  })
}).then(r => r.json());

// 2. Iniciar juego
const session = await fetch('http://localhost:5000/api/games/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: user.user.id,
    topic: 'El Sistema Solar',
    game_type: 'trivia',
    difficulty: 'medium'
  })
}).then(r => r.json());

// 3. Jugar (responder preguntas)
const answers = [
  { question_index: 0, selected_answer: 2, is_correct: true, points: 10 },
  { question_index: 1, selected_answer: 1, is_correct: false, points: 0 }
];

// 4. Enviar respuestas
const result = await fetch(`http://localhost:5000/api/games/${session.session.id}/submit`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ answers })
}).then(r => r.json());

console.log(result.result.feedback);
```

### Ejemplo: Obtener ranking

```bash
curl http://localhost:5000/api/users/leaderboard?limit=5
```

### Ejemplo: Análisis de inteligencias

```bash
curl -X POST http://localhost:5000/api/ai/analyze-intelligence \
  -H "Content-Type: application/json" \
  -d '{"user_id": "user-uuid-here"}'
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Datos inválidos",
  "details": [...]
}
```

### 404 Not Found
```json
{
  "error": "Usuario no encontrado"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error al generar contenido: ..."
}
```

---

## Rate Limits

- No hay rate limits en desarrollo
- En producción, considera implementar rate limiting con Flask-Limiter

## Authentication

- Actualmente: Sin autenticación (para desarrollo rápido)
- Producción: Implementar con Supabase Auth o JWT

---

**Para más información, ver el código en `backend/routes/`**
