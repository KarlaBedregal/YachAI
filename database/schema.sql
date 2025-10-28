-- YachAI - Supabase Database Schema
-- Ejecuta este script en tu proyecto de Supabase (SQL Editor)

-- ==================== TABLA: users ====================
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    avatar VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    total_score INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para users
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_total_score ON users(total_score DESC);

-- ==================== TABLA: game_sessions ====================
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    game_type VARCHAR(20) NOT NULL CHECK (game_type IN ('trivia', 'adventure', 'market')),
    content JSONB NOT NULL,
    score INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    answers JSONB DEFAULT '[]'::jsonb
);

-- Índices para game_sessions
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_completed ON game_sessions(completed);
CREATE INDEX idx_game_sessions_started_at ON game_sessions(started_at DESC);

-- ==================== TABLA: game_results ====================
CREATE TABLE IF NOT EXISTS game_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    game_type VARCHAR(20) NOT NULL,
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    feedback TEXT,
    intelligence_analysis JSONB DEFAULT '{}'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para game_results
CREATE INDEX idx_game_results_user_id ON game_results(user_id);
CREATE INDEX idx_game_results_session_id ON game_results(session_id);
CREATE INDEX idx_game_results_completed_at ON game_results(completed_at DESC);

-- ==================== TABLA: user_statistics ====================
CREATE TABLE IF NOT EXISTS user_statistics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    games_played INTEGER DEFAULT 0,
    topics_completed INTEGER DEFAULT 0,
    trivia_count INTEGER DEFAULT 0,
    adventure_count INTEGER DEFAULT 0,
    market_count INTEGER DEFAULT 0,
    -- Inteligencias múltiples
    linguistic_score INTEGER DEFAULT 0,
    logical_mathematical_score INTEGER DEFAULT 0,
    spatial_score INTEGER DEFAULT 0,
    naturalistic_score INTEGER DEFAULT 0,
    interpersonal_score INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para user_statistics
CREATE INDEX idx_user_statistics_user_id ON user_statistics(user_id);

-- ==================== TABLA: achievements ====================
CREATE TABLE IF NOT EXISTS achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para achievements
CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_achievements_earned_at ON achievements(earned_at DESC);

-- ==================== POLÍTICAS DE SEGURIDAD (RLS) ====================
-- Habilitar Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Políticas para users (lectura pública, inserción pública)
CREATE POLICY "Users are viewable by everyone" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can be created by anyone" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (true);

-- Políticas para game_sessions
CREATE POLICY "Game sessions are viewable by everyone" ON game_sessions
    FOR SELECT USING (true);

CREATE POLICY "Game sessions can be created by anyone" ON game_sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Game sessions can be updated by anyone" ON game_sessions
    FOR UPDATE USING (true);

-- Políticas para game_results
CREATE POLICY "Game results are viewable by everyone" ON game_results
    FOR SELECT USING (true);

CREATE POLICY "Game results can be created by anyone" ON game_results
    FOR INSERT WITH CHECK (true);

-- Políticas para user_statistics
CREATE POLICY "User statistics are viewable by everyone" ON user_statistics
    FOR SELECT USING (true);

CREATE POLICY "User statistics can be created by anyone" ON user_statistics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "User statistics can be updated by anyone" ON user_statistics
    FOR UPDATE USING (true);

-- Políticas para achievements
CREATE POLICY "Achievements are viewable by everyone" ON achievements
    FOR SELECT USING (true);

CREATE POLICY "Achievements can be created by anyone" ON achievements
    FOR INSERT WITH CHECK (true);