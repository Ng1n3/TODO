document.addEventListener("DOMContentLoaded", async () => {
  const todoList = document.getElementById("new_tasks");
  const totalTasksElement = document.getElementById("totalTasks");
  const deleteButton = document.getElementById("deleteButton");
  const deleteForm = document.getElementById("deleteForm");
  const completedTasksList = document.getElementById('completed_tasks')

  try {
    // Function to fetch and display todos
    const fetchAndDisplayTodos = async () => {
      todoList.innerHTML = ""; // Clear existing todos

      // Fetch existing todos from the server
      const response = await fetch("/users/api/note");
      const existingTodos = await response.json();

      // Fetch total counts of tasks
      const totalTasksResponse = await fetch("/users/api/note/count");
      const totalTaskscount = await totalTasksResponse.json();

      // Display total counts of tasks
      totalTasksElement.textContent = `${totalTaskscount} Tasks Left`;

      // Display existing todos
      if (existingTodos.length > 0) {
        existingTodos.forEach((todo) => {
          const listTodo = createTaskElement(todo);
          todoList.appendChild(listTodo);
        });
      } else {
        // Display a message if there are no existing todos
        const noTasksMessage = document.createElement("p");
        noTasksMessage.classList.add("noTask");
        noTasksMessage.textContent = "You currently have no tasks.";
        todoList.appendChild(noTasksMessage);
      }
    };

    // Function to create a task element with click event listener
    const createTaskElement = (todo) => {
      const listTodo = document.createElement("li");
      listTodo.textContent = todo.tasks;
      listTodo.classList.add("tasks_created");
      listTodo.setAttribute("data-task-id", todo._id);

      // Add click event listener to toggle color and update total count
      listTodo.addEventListener("click", async () => {
        listTodo.classList.toggle("completed-task");

        // Update total count of tasks
        const totalTasksResponse = await fetch("/users/api/note/count");
        const totalTasksCount = await totalTasksResponse.json();

        // Calculate the new count based on whether the task is completed
        const newTotalTasksCount = listTodo.classList.contains("completed-task")
          ? totalTasksCount - 1
          : totalTasksCount + 1;

        totalTasksElement.textContent = `${newTotalTasksCount} Tasks Left`;

        // Move task to completed tasks list
        if(listTodo.classList.contains('completed-tasks')) {
          completedTasksList.appendChild(listTodo)
        } else {
          todoList.appendChild(listTodo);
        }
      });



      return listTodo;
    };

    // Fetch and display todos on page load
    await fetchAndDisplayTodos();

    document
      .getElementById("inputTodoForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target.elements.tasks.value;

        const headers = { "Content-Type": "application/json" };

        try {
          // Create a new todo on the server
          const response = await fetch("/users/api/note", {
            method: "POST",
            body: JSON.stringify({ tasks: form }),
            headers,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          // Fetch and display todos after creating a new todo
          await fetchAndDisplayTodos();

          document.getElementById("taskInput").value = "";
        } catch (err) {
          console.error("Error creating todos", err);
        }
      });

    // Add click event listener to the Delete button
    deleteButton.addEventListener("click", async () => {
      const selectedTasks = document.querySelectorAll(".completed-task");
      selectedTasks.forEach(async (task) => {
        const taskId = task.getAttribute("data-task-id");

        // Delete task from the server
        const deleteResponse = await fetch(`/users/api/note/${taskId}`, {
          method: "DELETE",
        });

        if (!deleteResponse.ok) {
          console.error("Error deleting task", deleteResponse.statusText);
        }
      });

      // Fetch and display todos after deleting selected tasks
      await fetchAndDisplayTodos();
    });

    // Prevent form from triggering a GET request
    deleteForm.addEventListener("submit", (e) => {
      e.preventDefault();
    });
  } catch (error) {
    console.error("Error fetching todos", error);
  }
});
