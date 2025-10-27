import json
from groq import Groq
from typing import Dict, Any, List
from models.game import GameContent, GameType, TriviaQuestion, AdventureStory, AdventureScene, MarketMission, DifficultyLevel
from config import Config

class AIService:
    """Servicio para generar contenido educativo con IA"""
    
    def __init__(self):
        self.client = Groq(api_key=Config.GROQ_API_KEY)
        self.model = Config.AI_MODEL
        
    def generate_game_content(self, topic: str, game_type: GameType, 
                             difficulty: DifficultyLevel = DifficultyLevel.MEDIUM,
                             age_range: str = "8-14") -> GameContent:
        """Genera contenido para un juego específico"""
        
        if game_type == GameType.TRIVIA:
            trivia_questions = self._generate_trivia(topic, difficulty, age_range)
            return GameContent(
                topic=topic,
                game_type=game_type,
                difficulty=difficulty,
                trivia_questions=trivia_questions,
                age_range=age_range
            )
        elif game_type == GameType.ADVENTURE:
            adventure_story = self._generate_adventure(topic, difficulty, age_range)
            return GameContent(
                topic=topic,
                game_type=game_type,
                difficulty=difficulty,
                adventure_story=adventure_story,
                age_range=age_range
            )
        elif game_type == GameType.MARKET:
            market_missions = self._generate_market(topic, difficulty, age_range)
            return GameContent(
                topic=topic,
                game_type=game_type,
                difficulty=difficulty,
                market_missions=market_missions,
                age_range=age_range
            )
    
    def _generate_trivia(self, topic: str, difficulty: DifficultyLevel, age_range: str) -> List[TriviaQuestion]:
        """Genera preguntas de trivia"""
        
        prompt = f"""Eres un experto educador creando preguntas de trivia para niños de {age_range} años en Perú.

Tema: {topic}
Nivel: {difficulty.value}
Cantidad: {Config.TRIVIA_QUESTIONS_COUNT} preguntas

IMPORTANTE: Usa ejemplos y contexto local de Perú (lugares, animales, situaciones conocidas para niños peruanos).

Para cada pregunta, genera en formato JSON:
{{
    "question": "La pregunta clara y directa",
    "options": ["opción 1", "opción 2", "opción 3", "opción 4"],
    "correct_answer": 0-3 (índice de la respuesta correcta),
    "explanation": "Por qué esta es la respuesta correcta",
    "intelligence_type": "linguistic" | "logical_mathematical" | "spatial" | "naturalistic" | "interpersonal"
}}

Responde SOLO con un array JSON de {Config.TRIVIA_QUESTIONS_COUNT} preguntas, sin texto adicional."""

        response = self.client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=self.model,
            temperature=Config.TEMPERATURE,
            max_tokens=Config.MAX_TOKENS,
        )
        
        try:
            questions_data = json.loads(response.choices[0].message.content)
            questions = []
            for q in questions_data:
                questions.append(TriviaQuestion(
                    question=q["question"],
                    options=q["options"],
                    correct_answer=q["correct_answer"],
                    explanation=q["explanation"],
                    difficulty=difficulty,
                    intelligence_type=q.get("intelligence_type", "logical_mathematical")
                ))
            return questions
        except json.JSONDecodeError:
            raise ValueError("Error al parsear respuesta de IA para trivia")
    
    def _generate_adventure(self, topic: str, difficulty: DifficultyLevel, age_range: str) -> AdventureStory:
        """Genera una historia de aventura interactiva"""
        
        prompt = f"""Eres un escritor de cuentos educativos interactivos para niños de {age_range} años en Perú.

Tema educativo: {topic}
Nivel: {difficulty.value}
Contexto: Perú (usa lugares, animales, costumbres peruanas)

Crea una aventura interactiva de 5 escenas donde el niño aprende sobre {topic}.

Formato JSON:
{{
    "title": "Título atractivo de la aventura",
    "introduction": "Introducción que engancha (2-3 oraciones)",
    "scenes": [
        {{
            "scene_number": 1,
            "description": "Descripción de la escena (3-4 oraciones)",
            "choices": [
                {{
                    "text": "Opción 1",
                    "next_scene": 2,
                    "is_correct": true,
                    "points": 10,
                    "feedback": "¡Bien hecho! Explicación breve"
                }},
                {{
                    "text": "Opción 2",
                    "next_scene": 2,
                    "is_correct": false,
                    "points": 5,
                    "feedback": "Puedes hacerlo mejor. Explicación"
                }}
            ],
            "learning_point": "Qué aprende el niño en esta escena"
        }}
    ],
    "conclusion": "Final de la aventura (2-3 oraciones)",
    "total_scenes": 5
}}

Responde SOLO con el JSON, sin texto adicional."""

        response = self.client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=self.model,
            temperature=Config.TEMPERATURE,
            max_tokens=2500,
        )
        
        try:
            story_data = json.loads(response.choices[0].message.content)
            scenes = []
            for scene in story_data["scenes"]:
                scenes.append(AdventureScene(
                    scene_number=scene["scene_number"],
                    description=scene["description"],
                    choices=scene["choices"],
                    learning_point=scene["learning_point"]
                ))
            
            return AdventureStory(
                title=story_data["title"],
                introduction=story_data["introduction"],
                scenes=scenes,
                conclusion=story_data["conclusion"],
                total_scenes=story_data["total_scenes"]
            )
        except json.JSONDecodeError:
            raise ValueError("Error al parsear respuesta de IA para aventura")
    
    def _generate_market(self, topic: str, difficulty: DifficultyLevel, age_range: str) -> List[MarketMission]:
        """Genera misiones para el juego del mercadito"""
        
        prompt = f"""Eres un diseñador de juegos educativos para niños de {age_range} años en Perú.

Tema: {topic}
Nivel: {difficulty.value}
Contexto: Mercado peruano (usa productos, monedas, situaciones locales)

Crea {Config.MARKET_MISSIONS_COUNT} misiones educativas para un juego de mercado.

Tipos de tareas:
- "selection": elegir items correctos
- "math": resolver problemas matemáticos con productos
- "classification": clasificar items en categorías
- "matching": emparejar items relacionados

Formato JSON (array de {Config.MARKET_MISSIONS_COUNT} misiones):
[
    {{
        "mission_id": 1,
        "title": "Título de la misión",
        "description": "Descripción clara de qué hacer",
        "task_type": "selection",
        "items": [
            {{"id": "item1", "name": "Manzana", "price": 2, "category": "fruta", "image": "🍎"}},
            {{"id": "item2", "name": "Papa", "price": 3, "category": "verdura", "image": "🥔"}}
        ],
        "correct_items": ["item1", "item3"],
        "points": 10,
        "hint": "Pista útil",
        "intelligence_type": "logical_mathematical"
    }}
]

Responde SOLO con el array JSON, sin texto adicional."""

        response = self.client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=self.model,
            temperature=Config.TEMPERATURE,
            max_tokens=Config.MAX_TOKENS,
        )
        
        try:
            missions_data = json.loads(response.choices[0].message.content)
            missions = []
            for m in missions_data:
                missions.append(MarketMission(
                    mission_id=m["mission_id"],
                    title=m["title"],
                    description=m["description"],
                    task_type=m["task_type"],
                    items=m["items"],
                    correct_items=m["correct_items"],
                    points=m["points"],
                    hint=m["hint"],
                    intelligence_type=m.get("intelligence_type", "logical_mathematical")
                ))
            return missions
        except json.JSONDecodeError:
            raise ValueError("Error al parsear respuesta de IA para mercadito")
    
    def generate_feedback(self, topic: str, score: int, max_score: int, 
                         game_type: GameType, answers: List[Dict]) -> str:
        """Genera feedback personalizado basado en el desempeño"""
        
        percentage = (score / max_score * 100) if max_score > 0 else 0
        
        prompt = f"""Eres un tutor amigable para niños.

El estudiante jugó un juego de {game_type.value} sobre "{topic}".
Obtuvo {score} de {max_score} puntos ({percentage:.1f}%).

Genera un mensaje motivador y educativo (2-3 oraciones) que:
1. Felicite o anime según el puntaje
2. Resalte algo positivo
3. Dé una recomendación breve para mejorar o profundizar

Sé amigable, usa emojis y lenguaje para niños."""

        response = self.client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=self.model,
            temperature=0.8,
            max_tokens=200,
        )
        
        return response.choices[0].message.content.strip()
    
    def analyze_intelligence_profile(self, user_stats: Dict) -> Dict[str, Any]:
        """Analiza las inteligencias múltiples del usuario"""
        
        intelligences = {
            "linguistic": user_stats.get("linguistic_score", 0),
            "logical_mathematical": user_stats.get("logical_mathematical_score", 0),
            "spatial": user_stats.get("spatial_score", 0),
            "naturalistic": user_stats.get("naturalistic_score", 0),
            "interpersonal": user_stats.get("interpersonal_score", 0)
        }
        
        # Encuentra la más fuerte
        strongest = max(intelligences.items(), key=lambda x: x[1])
        
        intelligence_names = {
            "linguistic": "Lingüística (palabras y lenguaje)",
            "logical_mathematical": "Lógico-Matemática (números y razonamiento)",
            "spatial": "Espacial (imágenes y espacio)",
            "naturalistic": "Naturalista (naturaleza y ambiente)",
            "interpersonal": "Interpersonal (relaciones sociales)"
        }
        
        return {
            "scores": intelligences,
            "strongest": strongest[0],
            "strongest_name": intelligence_names[strongest[0]],
            "profile_description": self._get_intelligence_description(strongest[0])
        }
    
    def _get_intelligence_description(self, intelligence: str) -> str:
        """Descripción de cada tipo de inteligencia"""
        descriptions = {
            "linguistic": "¡Eres excelente con las palabras! Te encanta leer, escribir y comunicarte.",
            "logical_mathematical": "¡Tienes mente de científico! Los números y la lógica son tu fuerte.",
            "spatial": "¡Piensas en imágenes! Eres creativo y visualizas bien las cosas.",
            "naturalistic": "¡Amas la naturaleza! Observas y entiendes el mundo natural.",
            "interpersonal": "¡Eres muy social! Entiendes bien a las personas y trabajas genial en equipo."
        }
        return descriptions.get(intelligence, "¡Tienes muchos talentos!")
