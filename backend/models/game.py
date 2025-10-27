from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class GameType(str, Enum):
    """Tipos de juego disponibles"""
    TRIVIA = "trivia"
    ADVENTURE = "adventure"
    MARKET = "market"

class DifficultyLevel(str, Enum):
    """Niveles de dificultad"""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class TriviaQuestion(BaseModel):
    """Pregunta de trivia"""
    question: str
    options: List[str] = Field(..., min_length=3, max_length=4)
    correct_answer: int = Field(..., ge=0, le=3)
    explanation: str
    difficulty: DifficultyLevel = DifficultyLevel.MEDIUM
    intelligence_type: str = "logical_mathematical"  # tipo de inteligencia que evalúa

class AdventureScene(BaseModel):
    """Escena de aventura"""
    scene_number: int
    description: str
    image_prompt: Optional[str] = None  # para generar imágenes en el futuro
    choices: List[Dict[str, Any]]  # [{text: str, next_scene: int, is_correct: bool, points: int}]
    learning_point: str  # qué aprende en esta escena

class AdventureStory(BaseModel):
    """Historia completa de aventura"""
    title: str
    introduction: str
    scenes: List[AdventureScene]
    conclusion: str
    total_scenes: int

class MarketMission(BaseModel):
    """Misión del mercadito"""
    mission_id: int
    title: str
    description: str
    task_type: str  # "selection", "math", "classification", "matching"
    items: List[Dict[str, Any]]  # items disponibles en el mercado
    correct_items: List[str]  # IDs de items correctos
    points: int
    hint: str
    intelligence_type: str = "logical_mathematical"

class GameContent(BaseModel):
    """Contenido generado por IA para un juego"""
    topic: str
    game_type: GameType
    difficulty: DifficultyLevel = DifficultyLevel.MEDIUM
    # Contenido específico según tipo
    trivia_questions: Optional[List[TriviaQuestion]] = None
    adventure_story: Optional[AdventureStory] = None
    market_missions: Optional[List[MarketMission]] = None
    # Metadata
    generated_at: datetime = Field(default_factory=datetime.now)
    local_context: str = "Perú"
    age_range: str = "8-14"

class GameSession(BaseModel):
    """Sesión de juego"""
    id: Optional[str] = None
    user_id: str
    topic: str
    game_type: GameType
    content: GameContent
    score: int = 0
    completed: bool = False
    started_at: datetime = Field(default_factory=datetime.now)
    completed_at: Optional[datetime] = None
    answers: List[Dict[str, Any]] = []  # respuestas del usuario
    
class GameResult(BaseModel):
    """Resultado de un juego"""
    session_id: str
    user_id: str
    topic: str
    game_type: GameType
    score: int
    max_score: int
    percentage: float
    feedback: str  # feedback generado por IA
    intelligence_analysis: Dict[str, int]  # qué inteligencias se trabajaron
    recommendations: List[str]  # temas recomendados
