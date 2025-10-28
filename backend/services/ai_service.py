import json
from groq import Groq
from typing import Dict, Any, List
from models.game import GameContent, GameType, TriviaQuestion, AdventureStory, AdventureScene, MarketMission, DifficultyLevel
from config import Config
import re;

class AIService:
    """Servicio para generar contenido educativo con IA"""
    
    def __init__(self):
        self.client = Groq(api_key=Config.GROQ_API_KEY)
        self.model = "llama-3.3-70b-versatile"  # Cambiado de llama-3.1-70b-versatile
        
    
    def _clean_json_response(self, text: str, prefer_top: str = "auto") -> str:
        # Quitar fences de markdown
        text = re.sub(r'```json\s*', '', text)
        text = re.sub(r'```\s*', '', text)
        text = text.strip()

        # Intento directo: ¿ya es JSON válido?
        try:
            json.loads(text)
            return text
        except Exception:
            pass

        # Búsquedas
        obj_match = re.search(r'\{[\s\S]*\}', text)   # objeto más amplio
        arr_match = re.search(r'\[[\s\S]*\]', text)   # array más amplio

        def _strip_comments(s: str) -> str:
            # quita //comentarios al final de línea o fin de texto
            return re.sub(r'//.*?(?:\n|$)', '', s)

        # Preferencia explícita
        if prefer_top == "object" and obj_match:
            return _strip_comments(obj_match.group(0))
        if prefer_top == "array" and arr_match:
            return _strip_comments(arr_match.group(0))

        # Heurística "auto"
        if obj_match and ('"scenes"' in obj_match.group(0) or '"title"' in obj_match.group(0)):
            return _strip_comments(obj_match.group(0))
        if arr_match:
            return _strip_comments(arr_match.group(0))
        if obj_match:
            return _strip_comments(obj_match.group(0))

        return text

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
    "difficulty": "{difficulty.value}",
    "intelligence_type": "linguistic" | "logical_mathematical" | "spatial" | "naturalistic" | "interpersonal"
}}

Genera {Config.TRIVIA_QUESTIONS_COUNT} preguntas en este formato exacto."""

        response = self.client.chat.completions.create(
            messages=[
                {"role": "system", "content": "Eres un asistente que SOLO responde con JSON válido, sin texto adicional."},
                {"role": "user", "content": prompt}
            ],
            model=self.model,  
            temperature=Config.TEMPERATURE,
            max_tokens=Config.MAX_TOKENS,
        )
        
        try:
            raw_response = response.choices[0].message.content
            print(f"\n=== RESPUESTA CRUDA TRIVIA ===\n{raw_response}\n=== FIN ===\n")
            
            clean_response = self._clean_json_response(raw_response)
            print(f"\n=== RESPUESTA LIMPIA TRIVIA ===\n{clean_response}\n=== FIN ===\n")
            
            questions_data = json.loads(clean_response)
            
            # Asegurar que sea una lista
            if not isinstance(questions_data, list):
                questions_data = [questions_data]
            
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
        except json.JSONDecodeError as e:
            print(f"\n❌ Error parseando trivia: {str(e)}")
            print(f"Respuesta cruda:\n{raw_response}")
            raise ValueError(f"Error al parsear respuesta de IA para trivia: {str(e)}")
    
    
    def _generate_adventure(self, topic: str, difficulty: DifficultyLevel, age_range: str) -> AdventureStory:
        """Genera una historia de aventura interactiva"""
        
        prompt = f"""Eres un escritor de cuentos educativos interactivos para niños de {age_range} años en Perú.

Tema educativo: {topic}
Nivel: {difficulty.value}
IMPORTANTE:
- Contexto: Perú (usa lugares, animales, costumbres peruanas)
- Responde SOLO con el JSON, sin texto adicional
- NO respondas solo con el array de escenas
- La respuesta debe tener: title, introduction, scenes, conclusion, total_scenes
- NO uses comentarios
- Debe ser un OBJETO JSON (empieza con {{ y termina con }})

Crea una aventura interactiva con EXACTAMENTE 5 escenas.

Formato JSON EXACTO:
{{
    "title": "Título atractivo",
    "introduction": "Introducción que engancha (2-3 oraciones)",
    "scenes": [
        {{
            "scene_number": 1,
            "description": "Descripción de la escena",
            "choices": [
                {{
                    "text": "Primera opción",
                    "next_scene": 2,
                    "is_correct": true,
                    "points": 10,
                    "feedback": "¡Muy bien! Explicación"
                }},
                {{
                    "text": "Segunda opción",
                    "next_scene": 2,
                    "is_correct": false,
                    "points": 5,
                    "feedback": "Intenta de nuevo. Explicación"
                }}
            ],
            "learning_point": "Qué aprende aquí"
        }},
        {{
            "scene_number": 2,
            "description": "Segunda escena...",
            "choices": [
                {{
                    "text": "Opción A",
                    "next_scene": 3,
                    "is_correct": true,
                    "points": 10,
                    "feedback": "¡Correcto!"
                }},
                {{
                    "text": "Opción B",
                    "next_scene": 3,
                    "is_correct": false,
                    "points": 5,
                    "feedback": "No exactamente"
                }}
            ],
            "learning_point": "Lección de la escena"
        }},
        {{
            "scene_number": 3,
            "description": "Tercera escena...",
            "choices": [
                {{"text": "Opción 1", "next_scene": 4, "is_correct": true, "points": 10, "feedback": "¡Bien!"}},
                {{"text": "Opción 2", "next_scene": 4, "is_correct": false, "points": 5, "feedback": "Casi"}}
            ],
            "learning_point": "Aprendizaje"
        }},
        {{
            "scene_number": 4,
            "description": "Cuarta escena...",
            "choices": [
                {{"text": "Opción X", "next_scene": 5, "is_correct": true, "points": 10, "feedback": "¡Excelente!"}},
                {{"text": "Opción Y", "next_scene": 5, "is_correct": false, "points": 5, "feedback": "Intenta pensar mejor"}}
            ],
            "learning_point": "Concepto clave"
        }},
        {{
            "scene_number": 5,
            "description": "Escena final...",
            "choices": [
                {{"text": "Decisión final A", "next_scene": 0, "is_correct": true, "points": 10, "feedback": "¡Perfecto!"}},
                {{"text": "Decisión final B", "next_scene": 0, "is_correct": false, "points": 5, "feedback": "Otra vez será"}}
            ],
            "learning_point": "Conclusión del aprendizaje"
        }}
    ],
    "conclusion": "Final de la aventura (2-3 oraciones)",
    "total_scenes": 5
}}

Genera SOLO el objeto JSON de la aventura."""
        response = self.client.chat.completions.create(
            messages=[
                {"role": "system", "content": "Eres un asistente que SOLO responde con JSON válido, sin texto adicional."},
                {"role": "user", "content": prompt}
            ],
            model=self.model,
            temperature=0.7,
            max_tokens=2500,
            response_format={"type": "json_object"}
        )
        
        try:
            raw_response = response.choices[0].message.content
            print(f"\n=== RESPUESTA CRUDA AVENTURA ===\n{raw_response}\n=== FIN ===\n")
            
            clean_response = self._clean_json_response(raw_response, prefer_top="object")
            print(f"\n=== RESPUESTA LIMPIA AVENTURA ===\n{clean_response}\n=== FIN ===\n")
            
            story_data = json.loads(clean_response)
            
            # Si es un array, tomar el primer elemento
            if isinstance(story_data, list):
                print("[WARN] ️ La IA devolvió un array; asumo que es la lista de escenas y la envuelvo.")
                if story_data and all(isinstance(s, dict) and "scene_number" in s for s in story_data):
                    story_data = {
                        "title": f"Aventura educativa sobre {topic}",
                        "introduction": "",
                        "scenes": story_data,
                        "conclusion": "",
                        "total_scenes": len(story_data)
                    }
                else:
                    raise ValueError("La IA devolvió un array inesperado; no parece una lista de escenas.")

            
            # VALIDAR estructura
            if not isinstance(story_data, dict):
                raise ValueError(f"La respuesta debe ser un objeto JSON, pero es: {type(story_data)}")
            
            if 'scenes' not in story_data:
                raise ValueError("Falta la clave 'scenes'")
            
            if not isinstance(story_data['scenes'], list):
                raise ValueError("'scenes' debe ser una lista")
            
            # Construir escenas
            scenes = []
            for scene_data in story_data["scenes"]:
                # Validar que scene_data sea un diccionario
                if not isinstance(scene_data, dict):
                    print(f"� ️ Escena inválida (no es dict): {scene_data}")
                    continue
                
                scenes.append(AdventureScene(
                    scene_number=scene_data.get("scene_number", 0),
                    description=scene_data.get("description", ""),
                    choices=scene_data.get("choices", []),
                    learning_point=scene_data.get("learning_point", "")
                ))
            
            return AdventureStory(
                title=story_data.get("title", "Aventura educativa"),
                introduction=story_data.get("introduction", ""),
                scenes=scenes,
                conclusion=story_data.get("conclusion", ""),
                total_scenes=story_data.get("total_scenes", len(scenes))
            )
            
        except json.JSONDecodeError as e:
            print(f"\n❌ Error parseando aventura: {str(e)}")
            print(f"Respuesta cruda:\n{raw_response}")
            raise ValueError(f"Error al parsear respuesta de IA para aventura: {str(e)}")
        except KeyError as e:
            print(f"\n❌ Error de clave en aventura: {str(e)}")
            print(f"Datos recibidos:\n{story_data}")
            raise ValueError(f"Formato incorrecto de aventura: falta clave {str(e)}")
        except Exception as e:
            print(f"\n❌ Error general en aventura: {str(e)}")
            raise ValueError(f"Error al generar aventura: {str(e)}")


    def _generate_market(self, topic: str, difficulty: DifficultyLevel, age_range: str) -> List[MarketMission]:
        """Genera misiones para el juego del mercadito"""
        
        prompt = f"""Eres un diseñador de juegos educativos para niños de {age_range} años en Perú.


Tema: {topic}
Nivel: {difficulty.value}

IMPORTANTE:
- Contexto: mercado peruano (productos, monedas locales)
- Responde SOLO con un array JSON válido
- NO agregues texto antes o después
- NO uses comentarios

Formato:
[
  {{
    "mission_id": 1,
    "title": "título de la misión",
    "description": "qué debe hacer el niño",
    "task_type": "selection",
    "items": [
      {{"id": "item1", "name": "Manzana", "price": 2, "category": "fruta", "image": "🍎"}},
      {{"id": "item2", "name": "Papa", "price": 3, "category": "verdura", "image": "🥔"}}
    ],
    "correct_items": ["item1"],
    "points": 10,
    "hint": "pista útil",
    "intelligence_type": "logical_mathematical"
  }}
]

Genera {Config.MARKET_MISSIONS_COUNT} misiones en este formato exacto."""
        response = self.client.chat.completions.create(
            messages=[
                {"role": "system", "content": "Eres un asistente que SOLO responde con JSON válido, sin texto adicional."},
                {"role": "user", "content": prompt}
            ],
            model=self.model,
            temperature=0.7,
            max_tokens=Config.MAX_TOKENS,
        )
        try:
            raw_response = response.choices[0].message.content
            print(f"\n=== RESPUESTA CRUDA MERCADITO ===\n{raw_response}\n=== FIN ===\n")
            
            clean_response = self._clean_json_response(raw_response)
            print(f"\n=== RESPUESTA LIMPIA MERCADITO ===\n{clean_response}\n=== FIN ===\n")
            
            missions_data = json.loads(clean_response)
            
            # Asegurar que sea una lista
            if not isinstance(missions_data, list):
                missions_data = [missions_data]
            
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
        except json.JSONDecodeError as e:
            print(f"\n❌ Error parseando mercadito: {str(e)}")
            print(f"Respuesta cruda:\n{raw_response}")
            raise ValueError(f"Error al parsear respuesta de IA para mercadito: {str(e)}")



    
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
