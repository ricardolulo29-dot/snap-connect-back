CREATE TABLE
    IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        image TEXT NOT NULL,
        title TEXT,
        content TEXT,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );