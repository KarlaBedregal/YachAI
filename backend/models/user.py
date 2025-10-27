from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class User(BaseModel):
    """Modelo de usuario"""
    id: Optional[str] = None
    username: str = Field(..., min_length=3, max_length=20)
    avatar: str = Field(..., description="ID o nombre del avatar seleccionado")
    email: Optional[str] = None
    total_score: int = Field(default=0)
    level: int = Field(default=1)
    created_at: Optional[datetime] = None
    
class UserProgress(BaseModel):
    """Progreso del usuario"""
    user_id: str
    topics_completed: int = 0
    games_played: int = 0
    trivia_score: int = 0
    adventure_score: int = 0
    market_score: int = 0
    # Inteligencias múltiples
    linguistic_score: int = 0
    logical_mathematical_score: int = 0
    spatial_score: int = 0
    naturalistic_score: int = 0
    interpersonal_score: int = 0
    
class UserStats(BaseModel):
    """Estadísticas del usuario"""
    user_id: str
    favorite_game_type: Optional[str] = None
    strongest_intelligence: Optional[str] = None
    topics_mastered: list[str] = []
    achievements: list[str] = []
    total_time_played: int = 0  # en minutos
