from supabase import create_client, Client
from config import Config
from typing import Optional, Dict, Any, List
from datetime import datetime

class SupabaseService:
    """Servicio para manejar la base de datos Supabase"""
    
    def __init__(self):
        self.client: Client = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)
    
    # ========== USUARIOS ==========
    
    def create_user(self, username: str, avatar: str, email: Optional[str] = None) -> Dict[str, Any]:
        """Crea un nuevo usuario"""
        data = {
            "username": username,
            "avatar": avatar,
            "email": email,
            "total_score": 0,
            "level": 1,
            "created_at": datetime.now().isoformat()
        }
        
        result = self.client.table("users").insert(data).execute()
        return result.data[0] if result.data else None
    
    def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Obtiene un usuario por ID"""
        result = self.client.table("users").select("*").eq("id", user_id).execute()
        return result.data[0] if result.data else None
    
    def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """Obtiene un usuario por nombre de usuario"""
        result = self.client.table("users").select("*").eq("username", username).execute()
        return result.data[0] if result.data else None
    
    def update_user_score(self, user_id: str, points: int) -> bool:
        """Actualiza el puntaje del usuario"""
        user = self.get_user(user_id)
        if not user:
            return False
        
        new_score = user["total_score"] + points
        new_level = self._calculate_level(new_score)
        
        self.client.table("users").update({
            "total_score": new_score,
            "level": new_level
        }).eq("id", user_id).execute()
        
        return True
    
    def _calculate_level(self, score: int) -> int:
        """Calcula el nivel basado en el puntaje"""
        # Cada 100 puntos = 1 nivel
        return max(1, score // 100 + 1)
    
    # ========== SESIONES DE JUEGO ==========
    
    def create_game_session(self, user_id: str, topic: str, game_type: str, 
                           content: Dict[str, Any]) -> Dict[str, Any]:
        """Crea una nueva sesión de juego"""
        data = {
            "user_id": user_id,
            "topic": topic,
            "game_type": game_type,
            "content": content,
            "score": 0,
            "completed": False,
            "started_at": datetime.now().isoformat()
        }
        
        result = self.client.table("game_sessions").insert(data).execute()
        return result.data[0] if result.data else None
    
    def update_game_session(self, session_id: str, score: int, answers: List[Dict], 
                           completed: bool = False) -> bool:
        """Actualiza una sesión de juego"""
        data = {
            "score": score,
            "answers": answers,
            "completed": completed
        }
        
        if completed:
            data["completed_at"] = datetime.now().isoformat()
        
        self.client.table("game_sessions").update(data).eq("id", session_id).execute()
        return True
    
    def get_game_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Obtiene una sesión de juego"""
        result = self.client.table("game_sessions").select("*").eq("id", session_id).execute()
        return result.data[0] if result.data else None
    
    def get_user_sessions(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Obtiene las sesiones de un usuario"""
        result = self.client.table("game_sessions")\
            .select("*")\
            .eq("user_id", user_id)\
            .order("started_at", desc=True)\
            .limit(limit)\
            .execute()
        return result.data if result.data else []
    
    # ========== RESULTADOS Y PROGRESO ==========
    
    def save_game_result(self, session_id: str, user_id: str, topic: str, 
                        game_type: str, score: int, max_score: int,
                        feedback: str, intelligence_analysis: Dict,
                        recommendations: List[str]) -> Dict[str, Any]:
        """Guarda el resultado de un juego"""
        percentage = (score / max_score * 100) if max_score > 0 else 0
        
        data = {
            "session_id": session_id,
            "user_id": user_id,
            "topic": topic,
            "game_type": game_type,
            "score": score,
            "max_score": max_score,
            "percentage": percentage,
            "feedback": feedback,
            "intelligence_analysis": intelligence_analysis,
            "recommendations": recommendations,
            "completed_at": datetime.now().isoformat()
        }
        
        result = self.client.table("game_results").insert(data).execute()
        
        # Actualizar estadísticas del usuario
        self._update_user_statistics(user_id, game_type, intelligence_analysis)
        
        return result.data[0] if result.data else None
    
    def _update_user_statistics(self, user_id: str, game_type: str, 
                               intelligence_analysis: Dict):
        """Actualiza las estadísticas del usuario"""
        # Obtener o crear estadísticas
        stats = self.client.table("user_statistics")\
            .select("*")\
            .eq("user_id", user_id)\
            .execute()
        
        if stats.data:
            # Actualizar existente
            current = stats.data[0]
            update_data = {
                "games_played": current["games_played"] + 1,
                f"{game_type}_count": current.get(f"{game_type}_count", 0) + 1
            }
            
            # Actualizar inteligencias
            for intel, points in intelligence_analysis.items():
                key = f"{intel}_score"
                update_data[key] = current.get(key, 0) + points
            
            self.client.table("user_statistics")\
                .update(update_data)\
                .eq("user_id", user_id)\
                .execute()
        else:
            # Crear nuevo
            new_stats = {
                "user_id": user_id,
                "games_played": 1,
                f"{game_type}_count": 1,
                **{f"{intel}_score": points for intel, points in intelligence_analysis.items()}
            }
            self.client.table("user_statistics").insert(new_stats).execute()
    
    def get_user_statistics(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Obtiene las estadísticas del usuario"""
        result = self.client.table("user_statistics")\
            .select("*")\
            .eq("user_id", user_id)\
            .execute()
        return result.data[0] if result.data else None
    
    def get_leaderboard(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Obtiene el ranking global"""
        result = self.client.table("users")\
            .select("id, username, avatar, total_score, level")\
            .order("total_score", desc=True)\
            .limit(limit)\
            .execute()
        return result.data if result.data else []
    
    def get_user_achievements(self, user_id: str) -> List[Dict[str, Any]]:
        """Obtiene los logros del usuario"""
        result = self.client.table("achievements")\
            .select("*")\
            .eq("user_id", user_id)\
            .execute()
        return result.data if result.data else []
    
    def add_achievement(self, user_id: str, achievement_type: str, 
                       title: str, description: str) -> Dict[str, Any]:
        """Agrega un logro al usuario"""
        data = {
            "user_id": user_id,
            "achievement_type": achievement_type,
            "title": title,
            "description": description,
            "earned_at": datetime.now().isoformat()
        }
        
        result = self.client.table("achievements").insert(data).execute()
        return result.data[0] if result.data else None
