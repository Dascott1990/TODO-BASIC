document.addEventListener('DOMContentLoaded', function() {
    // Get all the task edit buttons
    const editBtns = document.querySelectorAll('.edit-btn');

    editBtns.forEach((editBtn) => {
        editBtn.addEventListener('click', function() {
            const taskItem = this.closest('.task');
            const taskDescription = taskItem.querySelector('.task-description');
            const taskInput = taskItem.querySelector('.task-input');
            const taskId = taskItem.id.split('-')[1]; // Extract task ID from the element ID

            // Toggle between edit and save mode
            if (taskInput.style.display === 'none') {
                taskDescription.style.display = 'none';
                taskInput.style.display = 'block';
                taskInput.focus();
                this.innerHTML = '<i class="fas fa-save"></i>';
            } else {
                const updatedDescription = taskInput.value.trim();
                if (updatedDescription) {
                    taskDescription.textContent = updatedDescription;
                    taskDescription.style.display = 'block';
                    taskInput.style.display = 'none';
                    this.innerHTML = '<i class="fas fa-edit"></i>';

                    // Send the updated description to the backend via POST request
                    fetch(`/tasks/${taskId}/edit`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: `description=${encodeURIComponent(updatedDescription)}`
                    }).then(response => response.json())
                      .then(data => {
                          console.log('Task updated:', data.message);
                      }).catch(error => {
                          console.error('Error updating task:', error);
                      });
                }
            }
        });
    });

    // Handle mark as done/undone
    const doneBtns = document.querySelectorAll('.done-btn, .undo-btn');
    doneBtns.forEach((btn) => {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            const taskId = this.closest('.task').id.split('-')[1]; // Get task ID

            fetch(this.closest('form').action, {
                method: 'POST',
            }).then(response => response.json())
              .then(data => {
                  console.log(data.message);
                  location.reload(); // Reload page to reflect changes
              }).catch(error => {
                  console.error('Error:', error);
              });
        });
    });

    // Handle delete task
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach((deleteBtn) => {
        deleteBtn.addEventListener('click', function(event) {
            event.preventDefault();
            const taskId = this.closest('.task').id.split('-')[1]; // Get task ID

            fetch(this.closest('form').action, {
                method: 'POST',
            }).then(response => response.json())
              .then(data => {
                  console.log(data.message);
                  location.reload(); // Reload page to remove task from the list
              }).catch(error => {
                  console.error('Error:', error);
              });
        });
    });
});
