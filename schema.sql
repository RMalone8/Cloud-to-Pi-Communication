CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    username TEXT UNIQUE NOT NULL,
    pass_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE flight_plans (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    missions_completed INTEGER
);

CREATE TABLE segments (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    plan_id TEXT NOT NULL REFERENCES flight_plans(id) ON DELETE CASCADE,
    sequence_order INTEGER NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL
);

CREATE TABLE missions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL REFERENCES flight_plans(id),
    started_at DATETIME,
    completed_at DATETIME
);

CREATE TABLE telemetry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mission_id TEXT REFERENCES missions(id) ON DELETE CASCADE,
    recorded_at DATETIME DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
    battery_level REAL,
    altitude_meters REAL
);