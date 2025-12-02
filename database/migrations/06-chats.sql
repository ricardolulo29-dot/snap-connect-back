CREATE TABLE
    IF NOT EXISTS chats (
        id SERIAL PRIMARY KEY,
        user_one_id INTEGER NOT NULL,
        user_two_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_one_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (user_two_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE (user_one_id, user_two_id)
    );