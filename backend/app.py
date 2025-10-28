from flask import Flask
from flask_cors import CORS
from routes.user_routes import user_bp
from routes.game_routes import game_bp
from routes.ai_routes import ai_bp
from config import Config

app = Flask(__name__)

# ARREGLO: Configurar CORS correctamente
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type"],
        "supports_credentials": True
    }
})

# Registrar blueprints
app.register_blueprint(user_bp)
app.register_blueprint(game_bp)
app.register_blueprint(ai_bp)

@app.route('/')
def index():
    return {
        "message": "🎮 YachAI API - Aprendizaje Gamificado con IA",
        "version": "1.0.0",
        "endpoints": {
            "users": "/api/users",
            "games": "/api/games",
            "ai": "/api/ai"
        }
    }

@app.route('/health')
def health():
    return {
        "status": "healthy",
        "message": "YachAI Backend is running! 🚀"
    }

if __name__ == '__main__':
    print("🎮 Iniciando YachAI Backend...")
    print(f"📡 API URL: http://localhost:{Config.PORT}")
    print(f"🤖 Modelo IA: llama-3.3-70b-versatile")
    print(f"🗄️  Base de datos: Supabase")
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)