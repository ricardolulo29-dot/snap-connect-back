CREATE TABLE
    IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS post_tags (
        post_id INTEGER NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
        tag_id INTEGER NOT NULL REFERENCES tags (id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (post_id, tag_id)
    );

CREATE INDEX idx_tags_name ON tags (name);

CREATE INDEX idx_post_tags_tag_id ON post_tags (tag_id);

CREATE INDEX idx_post_tags_post_id ON post_tags (post_id);