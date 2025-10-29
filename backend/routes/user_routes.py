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
        
        print(f"📥 Datos recibidos: {data}")
        
        if not data:
            return jsonify({"error": "No se enviaron datos"}), 400
        
        username = data.get('username')
        password = data.get('password')  # ← NUEVO
        avatar = data.get('avatar', 'default')
        age = data.get('age')  # ← NUEVO
        email = data.get('email')
        
        # Validaciones
        if not username:
            return jsonify({"error": "El username es requerido"}), 400
        
        if not password:
            return jsonify({"error": "La contraseña es requerida"}), 400
        
        if not age:
            return jsonify({"error": "La edad es requerida"}), 400
        
        # Validar con Pydantic
        try:
            user_data = User(
                username=username,
                password=password,
                avatar=avatar,
                age=age,
                email=email
            )
        except ValidationError as ve:
            print(f"❌ Error de validación: {ve}")
            return jsonify({
                "error": "Datos inválidos",
                "details": ve.errors()
            }), 400
        
        # Verificar si el username ya existe
        existing_user = db.get_user_by_username(username)
        if existing_user:
            return jsonify({"error": "El username ya existe"}), 400
        
        # Crear usuario
        new_user = db.create_user(
            username=username,
            password=password,
            avatar=avatar,
            age=age,
            email=email
        )
        
        print(f"✅ Usuario creado: {new_user}")
        
        return jsonify({
            "message": "Usuario creado exitosamente",
            "user": new_user
        }), 201
        
    except Exception as e:
        print(f"❌ Error en register_user: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error al crear usuario: {str(e)}"}), 500

@user_bp.route('/login', methods=['POST'])
def login_user():
    """Inicia sesión"""
    try:
        data = request.get_json()
        
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({"error": "Username y contraseña son requeridos"}), 400
        
        # Autenticar
        user = db.authenticate_user(username, password)
        
        if user:
            return jsonify({
                "message": "Login exitoso",
                "user": user
            }), 200
        else:
            return jsonify({"error": "Credenciales inválidas"}), 401
            
    except Exception as e:
        print(f"❌ Error en login_user: {str(e)}")
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
