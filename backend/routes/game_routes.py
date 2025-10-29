from flask import Blueprint, request, jsonify
from services import AIService, SupabaseService
from models.game import GameType, DifficultyLevel
from datetime import datetime  

game_bp = Blueprint('games', __name__, url_prefix='/api/games')
ai_service = AIService()
db = SupabaseService()

@game_bp.route('/start', methods=['POST'])
def start_game():
    """Inicia una nueva sesión de juego"""
    try:
        data = request.get_json()
        print(f"Datos recibidos para iniciar juego: {data}")

        user_id = data.get('user_id')
        topic = data.get('topic')
        game_type_str = data.get('game_type', 'trivia')
        difficulty_str = data.get('difficulty', 'medium')
        age_range = data.get('age_range', '8-14')

        if not all([user_id, topic, game_type_str]):
            return jsonify({"error": "Faltan datos requeridos"}), 400
        
        # Verificar que el usuario existe
        user = db.get_user(user_id)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        # Convertir a enums
        try:
            game_type = GameType(game_type_str)
            difficulty = DifficultyLevel(difficulty_str)
        except ValueError as e:
            return jsonify({"error": f"Tipo de juego o dificultad inválidos: {str(e)}"}), 400
        
        print(f"   Generando contenido con IA...")
        print(f"   Tema: {topic}")
        print(f"   Tipo: {game_type.value}")
        print(f"   Dificultad: {difficulty.value}")
        
        # Generar contenido con IA
        game_content = ai_service.generate_game_content(
            topic=topic,
            game_type=game_type,
            difficulty=difficulty,
            age_range=age_range
        )

        print(f"Contenido del juego generado: {game_content}")

        # Convertir contenido a dict
        content_dict = game_content.model_dump()
        if 'generated_at' in content_dict:
            content_dict['generated_at'] = content_dict['generated_at'].isoformat()

        session = db.create_game_session(
            user_id=user_id,
            topic=topic,
            game_type=game_type_str,
            difficulty=difficulty.value,
            age_range=age_range,
            content=content_dict 
        )
        
        print(f" Sesión creada: {session['id']}")

        # Convertir contenido a dict
        content_dict = game_content.model_dump()
        
        # Convertir datetime a string ISO
        if 'generated_at' in content_dict:
            content_dict['generated_at'] = content_dict['generated_at'].isoformat()

        # Devolver sesión con contenido
        response_data = {
            "message": "Sesión de juego creada",
            "session": session
        }
        
        return jsonify(response_data), 201
        
    except Exception as e:
        print(f"Error en start_game: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error al iniciar juego: {str(e)}"}), 500

@game_bp.route('/<session_id>/submit', methods=['POST'])
def submit_game(session_id):
    """Envía las respuestas y completa el juego"""
    try:
        data = request.get_json()
        
        print(f"Enviando respuestas para sesión: {session_id}")
        print(f"   Respuestas: {data}")
        
        answers = data.get('answers', [])
        
        session = db.get_game_session(session_id)
        if not session:
            return jsonify({"error": "Sesión no encontrada"}), 404
        
        if session.get('completed'):
            return jsonify({"error": "Esta sesión ya fue completada"}), 400
        
        if not session.get('content'):
            return jsonify({"error": "La sesión no tiene contenido"}), 400
        
        score, max_score, intelligence_analysis = calculate_score(
            session['content'], 
            answers, 
            session['game_type']
        )
        
        coins = score // 10

        db.update_game_session(session_id, score, answers, status="completed")
        
        db.update_user_score(
            user_id=session['user_id'],
            score=score,
            coins=coins
        )
        
        feedback = ai_service.generate_feedback(
            topic=session['topic'],
            score=score,
            max_score=max_score,
            game_type=GameType(session['game_type']),
            answers=answers
        )
        
        percentage = (score / max_score * 100) if max_score > 0 else 0
        recommendations = []
        
        if percentage >= 80:
            recommendations.append("¡Excelente trabajo! Intenta un nivel más difícil")
        elif percentage >= 60:
            recommendations.append("¡Buen trabajo! Sigue practicando para mejorar")
        else:
            recommendations.append("Sigue intentándolo. La práctica hace al maestro")
        
        response = {
            "result": {
                "session_id": session_id,
                "topic": session['topic'],
                "game_type": session['game_type'],
                "score": score,
                "max_score": max_score,
                "coins_earned": coins,
                "percentage": percentage,
                "feedback": feedback,
                "intelligence_analysis": intelligence_analysis,
                "recommendations": recommendations
            }
        }
        
        print(f"Juego completado - Score: {score}/{max_score} ({percentage:.1f}%)")
        
        return jsonify(response), 200
        
    except Exception as e:
        print(f"Error en submit_game: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@game_bp.route('/<session_id>', methods=['GET'])
def get_game(session_id):
    """Obtiene una sesión de juego"""
    try:
        session = db.get_game_session(session_id)
        if not session:
            return jsonify({"error": "Sesión no encontrada"}), 404
        
        return jsonify(session), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def calculate_score(content, answers, game_type):
    """Calcula el puntaje según el tipo de juego"""
    score = 0
    max_score = 0
    intelligence_analysis = {
        "linguistic": 0,
        "logical_mathematical": 0,
        "spatial": 0,
        "naturalistic": 0,
        "interpersonal": 0,
        "intrapersonal": 0,
        "musical": 0,
        "bodily_kinesthetic": 0

    }
    
    if game_type == 'trivia':
        questions = content.get('trivia_questions', [])
        max_score = len(questions) * 10
        
        for i, answer in enumerate(answers):
            if i < len(questions):
                question = questions[i]
                if answer.get('selected_answer') == question['correct_answer']:
                    points = 10
                    score += points
                    # Asignar puntos a la inteligencia correspondiente
                    intel_type = question.get('intelligence_type', 'logical_mathematical')
                    intelligence_analysis[intel_type] += points
    
    elif game_type == 'adventure':
        story = content.get('adventure_story', {})
        scenes = story.get('scenes', [])
        
        for answer in answers:
            scene_number = answer.get('scene_number', 0)
            choice_index = answer.get('choice_index', 0)
            
            if scene_number <= len(scenes):
                scene = scenes[scene_number - 1]
                if choice_index < len(scene['choices']):
                    choice = scene['choices'][choice_index]
                    points = choice.get('points', 0)
                    score += points
                    max_score += 10  # Máximo por escena
                    
                    # En aventuras, desarrolla inteligencia interpersonal y lingüística
                    intelligence_analysis['interpersonal'] += points // 2
                    intelligence_analysis['linguistic'] += points // 2
    
    elif game_type == 'market':
        missions = content.get('market_missions', [])
        
        for answer in answers:
            mission_id = answer.get('mission_id', 0)
            selected_items = answer.get('selected_items', [])
            
            if mission_id <= len(missions):
                mission = missions[mission_id - 1]
                correct_items = set(mission['correct_items'])
                selected_set = set(selected_items)
                
                # Puntaje basado en precisión
                correct_selected = len(correct_items & selected_set)
                total_correct = len(correct_items)
                
                if total_correct > 0:
                    points = int((correct_selected / total_correct) * mission['points'])
                    score += points
                    max_score += mission['points']
                    
                    # Asignar a la inteligencia correspondiente
                    intel_type = mission.get('intelligence_type', 'logical_mathematical')
                    intelligence_analysis[intel_type] += points
    
    return score, max_score, intelligence_analysis

def check_achievements(user_id, score, game_type):
    """Verifica y otorga logros"""
    # Obtener estadísticas
    stats = db.get_user_statistics(user_id)
    if not stats:
        return
    
    # Logro: Primera victoria
    if stats['games_played'] == 1:
        db.add_achievement(
            user_id=user_id,
            achievement_type="first_game",
            title="🎮 Primer Juego",
            description="¡Completaste tu primer juego en YachAI!"
        )
    
    # Logro: 10 juegos completados
    if stats['games_played'] == 10:
        db.add_achievement(
            user_id=user_id,
            achievement_type="veteran",
            title="Veterano",
            description="¡Completaste 10 juegos!"
        )
    
    # Logro: Puntuación perfecta
    if score >= 100:
        db.add_achievement(
            user_id=user_id,
            achievement_type="perfect_score",
            title="Puntuación Perfecta",
            description="¡Obtuviste más de 100 puntos en un juego!"
        )
@game_bp.route('/user/<user_id>/sessions', methods=['GET'])
def get_user_sessions(user_id):
    """Obtiene las sesiones de un usuario"""
    try:
        limit = request.args.get('limit', 10, type=int)
        sessions = db.get_user_game_sessions(user_id, limit)
        return jsonify(sessions), 200
    except Exception as e:
        print(f"Error en get_user_sessions: {str(e)}")
        return jsonify({"error": str(e)}), 500