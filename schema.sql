-- Run this once against your database to create the tables:
--   psql "$DATABASE_URL" -f schema.sql
-- (server.js also runs this automatically on startup, so this file
-- is here mainly for reference / manual setup.)

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    exam VARCHAR(10) NOT NULL CHECK (exam IN ('FE', 'PE', 'GRE')),
    subject VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    choices TEXT[] NOT NULL,
    correct_answer INTEGER NOT NULL,
    explanation TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scores (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    exam VARCHAR(10) NOT NULL CHECK (exam IN ('FE', 'PE', 'GRE')),
    question_id INTEGER NOT NULL REFERENCES questions(id),
    selected_answer INTEGER NOT NULL,
    correct BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_exam ON questions(exam);
CREATE INDEX IF NOT EXISTS idx_scores_user ON scores(user_id);
