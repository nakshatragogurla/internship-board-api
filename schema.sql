CREATE TABLE IF NOT EXISTS internships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    skills TEXT NOT NULL,
    duration TEXT NOT NULL,
    stipend TEXT,
    application_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);