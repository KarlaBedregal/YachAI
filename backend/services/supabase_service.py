from supabase import create_client, Client
from config import Config
from typing import Optional, Dict, Any, List
from datetime import datetime
from models.user import User

class SupabaseService:
    """Servicio para manejar la base de datos Supabase"""
    
    def __init__(self):
        """Inicializar cliente de Supabase"""
        try:
            if not Config.SUPABASE_URL or not Config.SUPABASE_KEY:
                raise ValueError("Faltan credenciales de Supabase en .env")
            
            self.supabase: Client = create_client(
                Config.SUPABASE_URL, 
                Config.SUPABASE_KEY
            )
            print("✅ Supabase conectado correctamente")
        except Exception as e:
            print(f"❌ Error al conectar con Supabase: {str(e)}")
            raise e
    
    # ========== USUARIOS ==========
    
    def create_user(self, username: str, password: str, avatar: str, age: int, email: Optional[str] = None) -> Dict[str, Any]:
        """Crea un nuevo usuario"""
        try:
            hashed_password = User.hash_password(password)
            
            user_data = {
                "username": username.lower(),
                "password": hashed_password,
                "avatar": avatar,
                "age": age,
                "email": email,
                "total_score": 0,
                "total_coins": 0,
                "level": 1
            }
            
            response = self.supabase.table("users").insert(user_data).execute()
            
            if response.data and len(response.data) > 0:
                user = response.data[0]
                user.pop('password', None)
                print(f"✅ Usuario creado: {user['username']}")
                return user
            else:
                raise Exception("No se pudo crear el usuario")
                
        except Exception as e:
            print(f"❌ Error en create_user: {str(e)}")
            raise e
    
    def authenticate_user(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        """Autentica un usuario"""
        try:
            print(f"\n🔐 === DEBUGGING LOGIN ===")
            print(f"Username recibido: '{username}'")
            print(f"Password recibido: '{password}'")
            
            response = self.supabase.table("users").select("*").eq("username", username.lower()).execute()
            
            print(f"Usuarios encontrados: {len(response.data) if response.data else 0}")
            
            if response.data and len(response.data) > 0:
                user = response.data[0]
                
                print(f"Usuario encontrado en BD:")
                print(f"  - ID: {user['id']}")
                print(f"  - Username: {user['username']}")
                print(f"  - Hash en BD: {user['password'][:30]}...")
                print(f"  - Edad: {user.get('age')}")
                
                print(f"\n🔑 Verificando contraseña...")
                is_valid = User.verify_password(password, user['password'])
                print(f"¿Contraseña válida? {is_valid}")
                
                if is_valid:
                    user.pop('password', None)
                    print(f"✅ Login exitoso: {username}")
                    return user
                else:
                    print(f"❌ Contraseña incorrecta para: {username}")
                    
                    test_hash = User.hash_password(password)
                    print(f"\n🧪 Hash de prueba con la contraseña '{password}':")
                    print(f"   Nuevo hash: {test_hash[:30]}...")
                    print(f"   Hash en BD: {user['password'][:30]}...")
                    print(f"   ¿Son iguales? {test_hash == user['password']}")
                    
                    return None
            else:
                print(f"❌ Usuario no encontrado: {username}")
                return None
        except Exception as e:
            print(f"❌ Error en authenticate_user: {str(e)}")
            import traceback
            traceback.print_exc()
            return None
    
    def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Obtiene un usuario por ID"""
        try:
            response = self.supabase.table("users").select("*").eq("id", user_id).execute()
            if response.data:
                user = response.data[0]
                user.pop('password', None)
                return user
            return None
        except Exception as e:
            print(f"❌ Error en get_user: {str(e)}")
            return None
    
    def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """Obtiene un usuario por username"""
        try:
            response = self.supabase.table("users").select("*").eq("username", username.lower()).execute()
            if response.data:
                user = response.data[0]
                user.pop('password', None)
                return user
            return None
        except Exception as e:
            print(f"❌ Error en get_user_by_username: {str(e)}")
            return None

    def update_user_score(self, user_id: str, score: int, coins: int) -> Dict[str, Any]:
        """Actualiza el puntaje y monedas del usuario"""
        try:
            user = self.get_user(user_id)
            if not user:
                raise Exception("Usuario no encontrado")
            
            new_total_score = user['total_score'] + score
            new_total_coins = user['total_coins'] + coins
            new_level = (new_total_score // 100) + 1
            
            response = self.supabase.table("users").update({
                "total_score": new_total_score,
                "total_coins": new_total_coins,
                "level": new_level
            }).eq("id", user_id).execute()
            
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            print(f"❌ Error en update_user_score: {str(e)}")
            raise e
    
    # ========== SESIONES DE JUEGO ==========
    
    def create_game_session(self, user_id: str, topic: str, game_type: str, 
                           difficulty: str, age_range: str, content: dict = None) -> Dict[str, Any]:
        """Crea una nueva sesión de juego"""
        try:
            session_data = {
                "user_id": user_id,
                "topic": topic,
                "game_type": game_type,
                "difficulty": difficulty,
                "age_range": age_range,
                "status": "in_progress",
                "score": 0,
                "content": content
            }
            
            response = self.supabase.table("game_sessions").insert(session_data).execute()
            
            if response.data:
                return response.data[0]
            raise Exception("No se pudo crear la sesión")
        except Exception as e:
            print(f"❌ Error en create_game_session: {str(e)}")
            raise e
    
    def update_game_session(self, session_id: str, score: int, answers: List[Dict], status: str = "completed") -> Dict[str, Any]:
        """Actualiza una sesión de juego"""
        try:
            update_data = {
                "score": score,
                "answers": answers,
                "status": status,
                "completed": True,
                "completed_at": datetime.utcnow().isoformat()
            }
            
            response = self.supabase.table("game_sessions").update(update_data).eq("id", session_id).execute()
            
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            print(f"❌ Error en update_game_session: {str(e)}")
            raise e
    
    def get_game_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Obtiene una sesión de juego"""
        try:
            response = self.supabase.table("game_sessions").select("*").eq("id", session_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"❌ Error en get_game_session: {str(e)}")
            return None
    
    def get_user_sessions(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Obtiene las sesiones de un usuario"""
        try:
            response = self.supabase.table("game_sessions")\
                .select("*")\
                .eq("user_id", user_id)\
                .order("started_at", desc=True)\
                .limit(limit)\
                .execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"❌ Error en get_user_sessions: {str(e)}")
            return []
    
    # ========== ESTADÍSTICAS Y PROGRESO ==========
    
    def get_user_statistics(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Obtiene estadísticas del usuario"""
        try:
            response = self.supabase.table("user_statistics").select("*").eq("user_id", user_id).execute()
            
            if response.data:
                return response.data[0]
            else:
                new_stats = {
                    "user_id": user_id,
                    "games_played": 0,
                    "topics_completed": 0,
                    "trivia_count": 0,
                    "adventure_count": 0,
                    "market_count": 0,
                    "linguistic_score": 0,
                    "logical_mathematical_score": 0,
                    "spatial_score": 0,
                    "naturalistic_score": 0,
                    "interpersonal_score": 0
                }
                create_response = self.supabase.table("user_statistics").insert(new_stats).execute()
                return create_response.data[0] if create_response.data else None
        except Exception as e:
            print(f"❌ Error en get_user_statistics: {str(e)}")
            return None
    
    def get_leaderboard(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Obtiene el ranking global"""
        try:
            response = self.supabase.table("users")\
                .select("id, username, avatar, total_score, level")\
                .order("total_score", desc=True)\
                .limit(limit)\
                .execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"❌ Error en get_leaderboard: {str(e)}")
            return []
    
    def get_user_achievements(self, user_id: str) -> List[Dict[str, Any]]:
        """Obtiene los logros del usuario"""
        try:
            response = self.supabase.table("achievements")\
                .select("*")\
                .eq("user_id", user_id)\
                .execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"❌ Error en get_user_achievements: {str(e)}")
            return []
    
    def add_achievement(self, user_id: str, achievement_type: str, 
                       title: str, description: str) -> Dict[str, Any]:
        """Agrega un logro al usuario"""
        try:
            data = {
                "user_id": user_id,
                "achievement_type": achievement_type,
                "title": title,
                "description": description,
                "earned_at": datetime.utcnow().isoformat()
            }
            
            response = self.supabase.table("achievements").insert(data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"❌ Error en add_achievement: {str(e)}")
            return None