from flask import Blueprint, request, jsonify
from services import SupabaseService
from models.user import User
from pydantic import ValidationError

user_bp = Blueprint('users', __name__, url_prefix='/api/users')
db = SupabaseService()

@user_bp.route('/register', methods=['POST'])
def register_user():
    """Registra un nuevo usuario"""
    try:
        data = request.get_json()
        
        # Validar con Pydantic
        user_data = User(
            username=data.get('username'),
            avatar=data.get('avatar'),
            email=data.get('email')
        )
        
        # Verificar si el username ya existe
        existing = db.get_user_by_username(user_data.username)
        if existing:
            return jsonify({"error": "El nombre de usuario ya existe"}), 400
        
        # Crear usuario
        user = db.create_user(
            username=user_data.username,
            avatar=user_data.avatar,
            email=user_data.email
        )
        
        return jsonify({
            "message": "Usuario creado exitosamente",
            "user": user
        }), 201
        
    except ValidationError as e:
        return jsonify({"error": "Datos inválidos", "details": e.errors()}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.route('/<user_id>', methods=['GET'])
def get_user(user_id):
    """Obtiene información de un usuario"""
    try:
        user = db.get_user(user_id)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        return jsonify(user), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.route('/username/<username>', methods=['GET'])
def get_user_by_username(username):
    """Obtiene un usuario por nombre de usuario"""
    try:
        user = db.get_user_by_username(username)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        return jsonify(user), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.route('/<user_id>/statistics', methods=['GET'])
def get_user_stats(user_id):
    """Obtiene las estadísticas del usuario"""
    try:
        stats = db.get_user_statistics(user_id)
        if not stats:
            return jsonify({
                "user_id": user_id,
                "games_played": 0,
                "message": "No hay estadísticas aún"
            }), 200
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.route('/<user_id>/achievements', methods=['GET'])
def get_achievements(user_id):
    """Obtiene los logros del usuario"""
    try:
        achievements = db.get_user_achievements(user_id)
        return jsonify(achievements), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.route('/<user_id>/sessions', methods=['GET'])
def get_user_sessions(user_id):
    """Obtiene las sesiones de juego del usuario"""
    try:
        limit = request.args.get('limit', 10, type=int)
        sessions = db.get_user_sessions(user_id, limit)
        return jsonify(sessions), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    """Obtiene el ranking global"""
    try:
        limit = request.args.get('limit', 10, type=int)
        leaderboard = db.get_leaderboard(limit)
        return jsonify(leaderboard), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
