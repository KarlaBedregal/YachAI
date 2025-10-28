import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Configuración general de la aplicación"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = os.getenv('DEBUG', 'True') == 'True'
    
    # Supabase
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
    
    # API de IA - Usando Groq (gratis y rápido)
    GROQ_API_KEY = os.getenv('GROQ_API_KEY')
    
    # Configuración de CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
    
    # Configuración de la IA
    AI_MODEL = os.getenv('AI_MODEL', 'llama-3.1-70b-versatile')
    MAX_TOKENS = int(os.getenv('MAX_TOKENS', '2000'))
    TEMPERATURE = float(os.getenv('TEMPERATURE', '0.7'))
    
    # Configuración de juegos
    TRIVIA_QUESTIONS_COUNT = 5
    ADVENTURE_CHOICES_COUNT = 3
    MARKET_MISSIONS_COUNT = 3
    
    # Contexto local
    LOCAL_CONTEXT = "Perú"
    LOCAL_EXAMPLES = True
    PORT = int(os.getenv('PORT', '5000'))
