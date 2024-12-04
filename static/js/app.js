const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const taskInput = document.getElementById("task-input");
    const taskDescription = taskInput.value.trim();

    if (taskDescription) {
        // Send the task to the server
        fetch("/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ description: taskDescription }),  // Sending as JSON
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.message) {
                // Add the new task to the list
                const listItem = document.createElement("li");
                listItem.classList.add("task");
                listItem.innerHTML = `
                    <div class="task-content">
                        <span class="task-description">${taskDescription}</span>
                        <input class="task-input" type="text" style="display:none;" value="${taskDescription}">
                    </div>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                    <button class="done-btn">Done</button>
                `;
                taskList.appendChild(listItem);
                taskInput.value = "";
                addTaskListeners(listItem);
            }
        })
        .catch((error) => {
            console.error("Error adding task:", error);
        });
    }
});

// Add event listeners for task buttons (edit, delete, done)
function addTaskListeners(taskItem) {
    const editBtn = taskItem.querySelector(".edit-btn");
    const deleteBtn = taskItem.querySelector(".delete-btn");
    const doneBtn = taskItem.querySelector(".done-btn");
    const taskDescription = taskItem.querySelector(".task-description");
    const taskInput = taskItem.querySelector(".task-input");

    editBtn.addEventListener("click", () => {
        taskDescription.style.display = "none";
        taskInput.style.display = "block";
        editBtn.textContent = "Save";
        editBtn.classList.add("save-btn");
        editBtn.classList.remove("edit-btn");

        // When the user clicks save, update the task
        editBtn.addEventListener("click", () => {
            const updatedDescription = taskInput.value.trim();
            if (updatedDescription) {
                taskDescription.textContent = updatedDescription;
                taskDescription.style.display = "block";
                taskInput.style.display = "none";
                editBtn.textContent = "Edit";
                editBtn.classList.add("edit-btn");
                editBtn.classList.remove("save-btn");

                // Send updated task to the server (optional)
                // You can use a PUT request to update the task in the database.
                // fetch(`/tasks/${taskItem.id}`, { method: 'PUT', body: JSON.stringify({ description: updatedDescription }) });
            }
        });
    });

    deleteBtn.addEventListener("click", () => {
        taskItem.remove();
    });

    doneBtn.addEventListener("click", () => {
        taskItem.classList.toggle("completed");
        doneBtn.classList.toggle("completed");
    });
}

// Initialize task listeners for tasks that are already in the DOM
document.querySelectorAll('.task').forEach(addTaskListeners);
