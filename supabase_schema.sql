-- Tabel Admins
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Subtests
CREATE TABLE IF NOT EXISTS subtests (
    id VARCHAR(50) PRIMARY KEY,
    number INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    group_name VARCHAR(100),
    item_type VARCHAR(50),
    default_time_limit_seconds INTEGER,
    is_active INTEGER DEFAULT 0
);

-- Tabel Subtest Sessions
CREATE TABLE IF NOT EXISTS subtest_sessions (
    id SERIAL PRIMARY KEY,
    subtest_id VARCHAR(50) REFERENCES subtests(id),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    finished_at TIMESTAMP WITH TIME ZONE,
    time_limit_seconds INTEGER,
    items_attempted INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    accuracy_percent REAL,
    items_per_minute REAL
);

-- Tabel Subtest Session Items
CREATE TABLE IF NOT EXISTS subtest_session_items (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES subtest_sessions(id) ON DELETE CASCADE,
    item_index INTEGER NOT NULL,
    stimulus JSONB NOT NULL,
    correct_answer INTEGER,
    user_answer INTEGER,
    is_correct BOOLEAN,
    answered_at_ms INTEGER
);

-- Data Seeding 11 Subtes
INSERT INTO subtests (id, number, name, group_name, item_type, default_time_limit_seconds, is_active)
VALUES 
('subtes_1', 1, 'Menghitung Huruf Sama', 'Learning Agility Index', 'letter_match_count', 360, 1),
('subtes_2', 2, 'Segera Hadir', 'Learning Agility Index', NULL, NULL, 0),
('subtes_3', 3, 'Selisih Huruf Terjauh', 'Learning Agility Index', NULL, NULL, 0),
('subtes_4', 4, 'Selisih Angka Terjauh', 'Learning Agility Index', NULL, NULL, 0),
('subtes_5', 5, 'Pasangan Huruf Diputar 90°', 'Learning Agility Index', NULL, NULL, 0),
('subtes_6', 6, 'Berhitung Angka', 'TIKI', NULL, NULL, 0),
('subtes_7', 7, 'Gabungan Bagian', 'TIKI', NULL, 420, 0),
('subtes_8', 8, 'Hubungan Kata', 'TIKI', NULL, 300, 0),
('subtes_9', 9, 'Abstraksi Non-Verbal', 'TIKI', NULL, NULL, 0),
('subtes_10', 10, 'Work Personality Analitik', 'Personality', NULL, NULL, 0),
('subtes_11', 11, 'Work Behavioral Assessment', 'Behavioral', NULL, NULL, 0)
ON CONFLICT (id) DO UPDATE SET 
    number = EXCLUDED.number,
    name = EXCLUDED.name,
    group_name = EXCLUDED.group_name,
    item_type = EXCLUDED.item_type,
    default_time_limit_seconds = EXCLUDED.default_time_limit_seconds,
    is_active = EXCLUDED.is_active;
