document.addEventListener("DOMContentLoaded", async () => {
    const todoList = document.getElementById("new_tasks");
  
    try {
      // Function to fetch and display todos
      const fetchAndDisplayTodos = async () => {
        todoList.innerHTML = ""; // Clear existing todos
  
        // Fetch existing todos from the server
        const response = await fetch("/users/api/note");
        const existingTodos = await response.json();
  
        // Display existing todos
        if (existingTodos.length > 0) {
          existingTodos.forEach((todo) => {
            const listTodo = document.createElement("li");
            listTodo.textContent = todo.tasks;
            todoList.appendChild(listTodo);
          });
        } else {
          // Display a message if there are no existing todos
          const noTasksMessage = document.createElement('p');
          noTasksMessage.textContent = 'You currently have no tasks.';
          todoList.appendChild(noTasksMessage);
        }
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
    } catch (error) {
      console.error("Error fetching todos", error);
    }
  });