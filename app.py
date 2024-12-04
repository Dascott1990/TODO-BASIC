import sqlite3
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
app.config['DATABASE'] = 'instance/todo.db'


# Function to connect to the database
def get_db_connection():
    conn = sqlite3.connect(app.config['DATABASE'])
    conn.row_factory = sqlite3.Row  # Access rows as dictionaries
    return conn


# Initialize the database schema
def init_db():
    with app.app_context():
        conn = get_db_connection()
        with open('schema.sql', 'r') as f:
            conn.executescript(f.read())
        conn.close()


@app.route("/")
def index():
    conn = get_db_connection()
    tasks = conn.execute("SELECT * FROM tasks").fetchall()
    conn.close()
    return render_template("index.html", tasks=tasks)


@app.route("/tasks", methods=["GET", "POST"])
def tasks():
    conn = get_db_connection()

    if request.method == "POST":
        data = request.get_json()  # Get the JSON data from the request body
        task_description = data.get("description")

        if task_description:
            conn.execute("INSERT INTO tasks (description) VALUES (?)", (task_description,))
            conn.commit()
            conn.close()
            return jsonify({"message": "Task added successfully!"}), 201
        else:
            return jsonify({"error": "Task description is required!"}), 400

    tasks = conn.execute("SELECT * FROM tasks").fetchall()
    conn.close()
    return jsonify([dict(row) for row in tasks])


@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    conn = get_db_connection()
    updated_description = request.json.get("description")
    conn.execute("UPDATE tasks SET description = ? WHERE id = ?", (updated_description, task_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Task updated successfully!"})


if __name__ == "__main__":
    # Uncomment the line below if you want to initialize the database only once
    # init_db()
    app.run(debug=True)
