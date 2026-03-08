from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import hashlib

app = Flask(__name__)
CORS(app)

def get_db():
    conn = sqlite3.connect('disciplineos.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    c.executescript('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS habits (
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            name TEXT,
            category TEXT,
            streak INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS habit_logs (
            id INTEGER PRIMARY KEY,
            habit_id INTEGER,
            completed BOOLEAN,
            logged_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS sleep_logs (
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            sleep_time TEXT,
            wake_time TEXT,
            quality INTEGER DEFAULT 5,
            logged_at DATE DEFAULT (date('now'))
        );
        CREATE TABLE IF NOT EXISTS fitness_logs (
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            steps INTEGER DEFAULT 0,
            workout_type TEXT,
            duration INTEGER DEFAULT 0,
            calories INTEGER DEFAULT 0,
            logged_at DATE DEFAULT (date('now'))
        );
    ''')
    conn.commit()
    conn.close()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/')
def home():
    return jsonify({"message": "DisciplineOS API is running!", "status": "success"})

# ─── AUTH ───────────────────────────────────────────────────────────────────

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = hash_password(data.get('password'))
    try:
        conn = get_db()
        c = conn.cursor()
        c.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", (name, email, password))
        conn.commit()
        user_id = c.lastrowid
        conn.close()
        return jsonify({"success": True, "message": "Account created!", "user": {"id": user_id, "name": name, "email": email}})
    except:
        return jsonify({"success": False, "message": "Email already exists!"})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = hash_password(data.get('password'))
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email=? AND password=?", (email, password))
    user = c.fetchone()
    conn.close()
    if user:
        return jsonify({"success": True, "message": "Login successful!", "user": {"id": user['id'], "name": user['name'], "email": user['email']}})
    return jsonify({"success": False, "message": "Invalid email or password!"})

# ─── HABITS ─────────────────────────────────────────────────────────────────

@app.route('/habits/<int:user_id>', methods=['GET'])
def get_habits(user_id):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM habits WHERE user_id=? ORDER BY created_at DESC", (user_id,))
    habits = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(habits)

@app.route('/habits', methods=['POST'])
def add_habit():
    data = request.json
    conn = get_db()
    c = conn.cursor()
    c.execute("INSERT INTO habits (user_id, name, category) VALUES (?, ?, ?)",
              (data.get('user_id'), data.get('name'), data.get('category')))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Habit added!"})

@app.route('/habits/complete', methods=['POST'])
def complete_habit():
    data = request.json
    habit_id = data.get('habit_id')
    conn = get_db()
    c = conn.cursor()
    c.execute("INSERT INTO habit_logs (habit_id, completed) VALUES (?, ?)", (habit_id, True))
    c.execute("UPDATE habits SET streak = streak + 1 WHERE id=?", (habit_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Habit completed! 🔥"})

@app.route('/habits/<int:habit_id>', methods=['DELETE'])
def delete_habit(habit_id):
    conn = get_db()
    c = conn.cursor()
    c.execute("DELETE FROM habits WHERE id=?", (habit_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Habit deleted!"})

# ─── SLEEP ──────────────────────────────────────────────────────────────────

@app.route('/sleep/<int:user_id>', methods=['GET'])
def get_sleep(user_id):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM sleep_logs WHERE user_id=? ORDER BY logged_at DESC LIMIT 7", (user_id,))
    logs = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(logs)

@app.route('/sleep', methods=['POST'])
def add_sleep():
    data = request.json
    conn = get_db()
    c = conn.cursor()
    c.execute("INSERT INTO sleep_logs (user_id, sleep_time, wake_time, quality) VALUES (?, ?, ?, ?)",
              (data.get('user_id'), data.get('sleep_time'), data.get('wake_time'), data.get('quality', 5)))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Sleep logged!"})

# ─── FITNESS ────────────────────────────────────────────────────────────────

@app.route('/fitness/<int:user_id>', methods=['GET'])
def get_fitness(user_id):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM fitness_logs WHERE user_id=? ORDER BY logged_at DESC LIMIT 7", (user_id,))
    logs = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(logs)

@app.route('/fitness', methods=['POST'])
def add_fitness():
    data = request.json
    conn = get_db()
    c = conn.cursor()
    c.execute("INSERT INTO fitness_logs (user_id, steps, workout_type, duration, calories) VALUES (?, ?, ?, ?, ?)",
              (data.get('user_id'), data.get('steps', 0), data.get('workout_type'), data.get('duration', 0), data.get('calories', 0)))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Workout logged!"})

# ─── DASHBOARD ──────────────────────────────────────────────────────────────

@app.route('/dashboard/<int:user_id>', methods=['GET'])
def get_dashboard(user_id):
    conn = get_db()
    c = conn.cursor()

    c.execute("SELECT COUNT(*) as total FROM habits WHERE user_id=?", (user_id,))
    total_habits = c.fetchone()['total']

    c.execute("SELECT MAX(streak) as best FROM habits WHERE user_id=?", (user_id,))
    best_streak = c.fetchone()['best'] or 0

    c.execute("SELECT COUNT(*) as total FROM habit_logs hl JOIN habits h ON hl.habit_id = h.id WHERE h.user_id=?", (user_id,))
    total_completions = c.fetchone()['total']

    c.execute("SELECT SUM(steps) as steps FROM fitness_logs WHERE user_id=? AND logged_at = date('now')", (user_id,))
    today_steps = c.fetchone()['steps'] or 0

    c.execute("SELECT wake_time, sleep_time FROM sleep_logs WHERE user_id=? ORDER BY logged_at DESC LIMIT 1", (user_id,))
    last_sleep = c.fetchone()

    conn.close()
    return jsonify({
        "total_habits": total_habits,
        "best_streak": best_streak,
        "total_completions": total_completions,
        "today_steps": today_steps,
        "last_sleep": dict(last_sleep) if last_sleep else None
    })

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)