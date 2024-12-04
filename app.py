from flask import Flask, render_template, request, jsonify, redirect, url_for
import sqlite3

app = Flask(__name__)
app.config['DATABASE'] = 'instance/todo.db'

# Function to connect to the database
def get_db_connection():
    conn = sqlite3.connect(app.config['DATABASE'])
    conn.row_factory = sqlite3.Row  # Access rows as dictionaries
    return conn

# Route to show the task list
@app.route("/")
def index():
    conn = get_db_connection()
    tasks = conn.execute("SELECT * FROM tasks").fetchall()
    conn.close()
    return render_template("index.html", tasks=tasks)

# Route to add a new task
@app.route("/tasks", methods=["POST"])
def add_task():
    task_description = request.form["description"]
    if task_description:
        conn = get_db_connection()
        conn.execute("INSERT INTO tasks (description) VALUES (?)", (task_description,))
        conn.commit()
        conn.close()
    return redirect(url_for("index"))

# Route to update a task description (Edit Task)
@app.route("/tasks/<int:task_id>/edit", methods=["POST"])
def edit_task(task_id):
    new_description = request.form["description"]
    conn = get_db_connection()
    conn.execute("UPDATE tasks SET description = ? WHERE id = ?", (new_description, task_id))
    conn.commit()
    conn.close()
    return jsonify({"status": "success", "message": "Task updated"})

# Route to delete a task
@app.route("/tasks/<int:task_id>/delete", methods=["POST"])
def delete_task(task_id):
    conn = get_db_connection()
    conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()
    return jsonify({"status": "success", "message": "Task deleted"})

# Route to mark a task as done
@app.route("/tasks/<int:task_id>/done", methods=["POST"])
def mark_done(task_id):
    conn = get_db_connection()
    conn.execute("UPDATE tasks SET completed = 1 WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()
    return jsonify({"status": "success", "message": "Task marked as done"})

# Route to mark a task as undone
@app.route("/tasks/<int:task_id>/undone", methods=["POST"])
def mark_undone(task_id):
    conn = get_db_connection()
    conn.execute("UPDATE tasks SET completed = 0 WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()
    return jsonify({"status": "success", "message": "Task marked as undone"})

if __name__ == "__main__":
    app.run(debug=True)
