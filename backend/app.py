from flask import Flask
from flask_cors import CORS
from config import Config

# Importar blueprints
from routes.user_routes import user_bp
from routes.ai_routes import ai_bp
from routes.game_routes import game_bp

def create_app():
    """Factory para crear la aplicación Flask"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Configurar CORS
    CORS(app, origins=Config.CORS_ORIGINS)
    
    # Registrar blueprints
    app.register_blueprint(user_bp)
    app.register_blueprint(ai_bp)
    app.register_blueprint(game_bp)
    
    # Ruta de salud
    @app.route('/health')
    def health():
        return {"status": "healthy", "message": "YachAI Backend is running! 🚀"}, 200
    
    @app.route('/')
    def index():
        return {
            "message": "YachAI - Aprendizaje Gamificado con IA 🎮",
            "version": "1.0.0",
            "endpoints": {
                "users": "/api/users",
                "ai": "/api/ai",
                "games": "/api/games"
            }
        }, 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=Config.DEBUG
    )
