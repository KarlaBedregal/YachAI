from flask import Blueprint, request, jsonify
from services import AIService, SupabaseService
from models.game import GameType, DifficultyLevel
from datetime import datetime  # ← AGREGAR ESTO

game_bp = Blueprint('games', __name__, url_prefix='/api/games')
ai_service = AIService()
db = SupabaseService()

@game_bp.route('/start', methods=['POST'])
def start_game():
    """Inicia una nueva sesión de juego"""
    try:
        data = request.get_json()
        
        user_id = data.get('user_id')
        topic = data.get('topic')
        game_type_str = data.get('game_type', 'trivia')
        difficulty_str = data.get('difficulty', 'medium')
        age_range = data.get('age_range', '8-14')
        
        if not user_id or not topic:
            return jsonify({"error": "user_id y topic son requeridos"}), 400
        
        # Verificar que el usuario existe
        user = db.get_user(user_id)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        # Convertir a enums
        game_type = GameType(game_type_str)
        difficulty = DifficultyLevel(difficulty_str)
        
        # Generar contenido con IA
        content = ai_service.generate_game_content(
            topic=topic,
            game_type=game_type,
            difficulty=difficulty,
            age_range=age_range
        )
        
        # Convertir a dict para guardar en DB
        content_dict = content.model_dump()
        
        # ARREGLO: Convertir datetime a string ISO
        if 'generated_at' in content_dict:
            content_dict['generated_at'] = content_dict['generated_at'].isoformat()
        
        # Crear sesión en base de datos
        session = db.create_game_session(
            user_id=user_id,
            topic=topic,
            game_type=game_type_str,
            content=content_dict
        )
        
        return jsonify({
            "message": "Sesión de juego creada",
            "session": session
        }), 201
        
    except Exception as e:
        print(f"Error en start_game: {str(e)}")  # ← Ver el error en consola
        return jsonify({"error": f"Error al iniciar juego: {str(e)}"}), 500

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

@game_bp.route('/<session_id>/submit', methods=['POST'])
def submit_game(session_id):  
    """Envía las respuestas y completa el juego"""
    try:
        # session_id ya viene del parámetro de la ruta
        data = request.get_json()
        
        answers = data.get('answers', [])
        
        # Obtener sesión
        session = db.get_game_session(session_id)
        if not session:
            return jsonify({"error": "Sesión no encontrada"}), 404
        
        if session['completed']:
            return jsonify({"error": "Esta sesión ya fue completada"}), 400
        
        # Calcular puntaje
        score, max_score, intelligence_analysis = calculate_score(
            session['content'], 
            answers, 
            session['game_type']
        )
        
        # Actualizar sesión
        db.update_game_session(session_id, score, answers, completed=True)
        
        # Generar feedback con IA
        feedback = ai_service.generate_feedback(
            topic=session['topic'],
            score=score,
            max_score=max_score,
            game_type=GameType(session['game_type']),
            answers=answers
        )
        
        # Generar recomendaciones (simplificado)
        recommendations = generate_recommendations(
            session['topic'], 
            score, 
            max_score
        )
        
        # Guardar resultado
        result = db.save_game_result(
            session_id=session_id,
            user_id=session['user_id'],
            topic=session['topic'],
            game_type=session['game_type'],
            score=score,
            max_score=max_score,
            feedback=feedback,
            intelligence_analysis=intelligence_analysis,
            recommendations=recommendations
        )
        
        # Actualizar puntaje del usuario
        db.update_user_score(session['user_id'], score)
        
        # Verificar logros
        check_achievements(session['user_id'], score, session['game_type'])
        
        return jsonify({
            "message": "Juego completado",
            "result": result
        }), 200
        
    except Exception as e:
        print(f"\n❌ Error en submit_game: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error al enviar juego: {str(e)}"}), 500


def calculate_score(content, answers, game_type):
    """Calcula el puntaje según el tipo de juego"""
    score = 0
    max_score = 0
    intelligence_analysis = {
        "linguistic": 0,
        "logical_mathematical": 0,
        "spatial": 0,
        "naturalistic": 0,
        "interpersonal": 0
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

def generate_recommendations(topic, score, max_score):
    """Genera recomendaciones de temas"""
    percentage = (score / max_score * 100) if max_score > 0 else 0
    
    recommendations = []
    
    if percentage < 60:
        recommendations.append(f"Repasa: {topic}")
        recommendations.append("Practica más con ejercicios similares")
    elif percentage < 80:
        recommendations.append(f"¡Buen trabajo! Refuerza {topic}")
        recommendations.append("Intenta el siguiente nivel de dificultad")
    else:
        recommendations.append(f"¡Excelente! Dominas {topic}")
        recommendations.append("Explora temas relacionados")
    
    return recommendations

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
            title="⭐ Veterano",
            description="¡Completaste 10 juegos!"
        )
    
    # Logro: Puntuación perfecta
    if score >= 100:
        db.add_achievement(
            user_id=user_id,
            achievement_type="perfect_score",
            title="💯 Puntuación Perfecta",
            description="¡Obtuviste más de 100 puntos en un juego!"
        )
