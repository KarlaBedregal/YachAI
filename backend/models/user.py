from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
import hashlib

class User(BaseModel):
    """Modelo de usuario"""
    id: Optional[str] = None
    username: str = Field(..., min_length=3, max_length=20)
    password: str = Field(..., min_length=6) 
    avatar: str = Field(default="default")
    email: Optional[str] = None
    age: int = Field(..., ge=5, le=18) 
    total_score: int = Field(default=0)
    total_coins: int = Field(default=0)  
    level: int = Field(default=1)
    created_at: Optional[datetime] = None

    @field_validator('username')
    @classmethod
    def username_alphanumeric(cls, v):
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('El username solo puede contener letras, números, guiones y guiones bajos')
        return v.lower()
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash de contraseña con SHA256 (para desarrollo)"""
        return hashlib.sha256(password.encode('utf-8')).hexdigest()
    
    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        """Verifica contraseña con SHA256"""
        try:
            password_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()
            return password_hash == hashed
        except Exception as e:
            print(f"❌ Error verificando contraseña: {str(e)}")
            return False
    
class UserProgress(BaseModel):
    """Progreso del usuario"""
    user_id: str
    topics_completed: int = 0
    games_played: int = 0
    trivia_score: int = 0
    adventure_score: int = 0
    market_score: int = 0
    total_time_minutes: int = 0
    # Inteligencias múltiples
    linguistic_score: int = 0
    logical_mathematical_score: int = 0
    spatial_score: int = 0
    naturalistic_score: int = 0
    interpersonal_score: int = 0
    intrapersonal_score: int = 0
    musical_score: int = 0
    bodily_kinesthetic_score: int = 0
    
class UserStats(BaseModel):
    """Estadísticas del usuario"""
    user_id: str
    total_games: int
    total_score: int
    total_coins: int  
    average_score: float
    strongest_intelligence: Optional[str] = None
    favorite_game_type: Optional[str] = None
    topics_mastered: list[str] = []
    achievements: list[str] = []
    total_time_played: int = 0  # en minutos