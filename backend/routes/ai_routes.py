from flask import Blueprint, request, jsonify
from services import AIService, SupabaseService
from models.game import GameType, DifficultyLevel, GameContent
from pydantic import ValidationError

ai_bp = Blueprint('ai', __name__, url_prefix='/api/ai')
ai_service = AIService()
db = SupabaseService()

@ai_bp.route('/generate-content', methods=['POST'])
def generate_content():
    """Genera contenido de juego con IA"""
    try:
        data = request.get_json()
        
        topic = data.get('topic')
        game_type_str = data.get('game_type', 'trivia')
        difficulty_str = data.get('difficulty', 'medium')
        age_range = data.get('age_range', '8-14')
        
        if not topic:
            return jsonify({"error": "El tema es requerido"}), 400
        
        # Convertir strings a enums
        try:
            game_type = GameType(game_type_str)
            difficulty = DifficultyLevel(difficulty_str)
        except ValueError:
            return jsonify({"error": "Tipo de juego o dificultad inválidos"}), 400
        
        # Generar contenido
        content = ai_service.generate_game_content(
            topic=topic,
            game_type=game_type,
            difficulty=difficulty,
            age_range=age_range
        )
        
        return jsonify({
            "message": "Contenido generado exitosamente",
            "content": content.model_dump()
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Error al generar contenido: {str(e)}"}), 500

@ai_bp.route('/generate-feedback', methods=['POST'])
def generate_feedback():
    """Genera feedback personalizado"""
    try:
        data = request.get_json()
        
        topic = data.get('topic')
        score = data.get('score', 0)
        max_score = data.get('max_score', 100)
        game_type_str = data.get('game_type', 'trivia')
        answers = data.get('answers', [])
        
        game_type = GameType(game_type_str)
        
        feedback = ai_service.generate_feedback(
            topic=topic,
            score=score,
            max_score=max_score,
            game_type=game_type,
            answers=answers
        )
        
        return jsonify({
            "feedback": feedback
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Error al generar feedback: {str(e)}"}), 500

@ai_bp.route('/analyze-intelligence', methods=['POST'])
def analyze_intelligence():
    """Analiza el perfil de inteligencias múltiples del usuario"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({"error": "user_id es requerido"}), 400
        
        # Obtener estadísticas del usuario
        stats = db.get_user_statistics(user_id)
        if not stats:
            return jsonify({
                "message": "No hay suficientes datos para analizar",
                "profile": None
            }), 200
        
        # Analizar perfil
        profile = ai_service.analyze_intelligence_profile(stats)
        
        return jsonify({
            "message": "Análisis completado",
            "profile": profile
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Error al analizar inteligencias: {str(e)}"}), 500
