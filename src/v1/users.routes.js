const express = require("express");
const router = express.Router();
const middleware = require("../middleware/users.middleware");
const controller = require("../controller/users.controller");
const todoModel = require("../model/todo.model");
const userModel = require("../model/users.model");

// Render signup page
router.get("/signup", (req, res) => {
  res.render("signup", { title: "Signup" });
});

// Render login page
router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

// Handle user signup
router.post("/signup", middleware.ValidUserCreation, controller.createUser);

// Handle user login
router.post("/login", middleware.loginValidation, controller.loginUser);

// Render note page
router.get("/note", middleware.isAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const todos = await todoModel.find({ user_id: userId });
    const user = await userModel.find({ username: req.session.username });
    res.render("note", { todos, user, title: "Dashboard" });
  } catch (error) {
    console.error("Error rendering note page", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get total count of tasks
router.get("/api/note/count", middleware.isAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const totalTasksCount = await todoModel.countDocuments({ user_id: userId });
    res.json(totalTasksCount);
  } catch (error) {
    console.error("Error counting tasks", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new task
router.post("/api/note", middleware.isAuth, async (req, res) => {
  try {
    const { tasks } = req.body;
    const userId = req.session.userId;
    const todos = await todoModel.create({
      tasks,
      user_id: userId,
    });
    const savedTodos = await todos.save();
    res.json(savedTodos);
  } catch (error) {
    console.error("Error creating task", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a task
router.delete("/api/note/:taskId", middleware.isAuth, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.session.userId;

    // Check if the task belongs to the logged-in user
    const task = await todoModel.findOne({ _id: taskId, user_id: userId });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Remove the task from the database
    await todoModel.findByIdAndRemove(taskId);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all tasks
router.get("/api/note", middleware.isAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const todos = await todoModel.find({ user_id: userId });
    res.json(todos);
  } catch (error) {
    console.error("Error fetching tasks", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
  });
  res.redirect("/users/login");
});

module.exports = router;

