const express = require("express");
const router = express.Router();
const middleware = require("../middleware/users.middleware");
const controller = require("../controller/users.controller");
const todoModel = require("../model/todo.model");
const userModel = require("../model/users.model");

router.get("/signup", (req, res) => {
  res.render("signup", {title: "Signup"});
});

router.get("/login", (req, res) => {
  res.render("login", {title: 'Login'});
});
router.post("/signup", middleware.ValidUserCreation, controller.createUser);

router.post("/login", middleware.loginValidation, controller.loginUser);

router.get("/note", middleware.isAuth, async (req, res) => {
  const todos = await todoModel.find({ user_id: req.session.userId });
  const user = await userModel.find({ username: req.session.username });
  res.render("note", { todos, user, title: "Dashboard" });
});

router.post("/api/note", middleware.isAuth, async (req, res) => {
  const { tasks } = req.body;
  const userId = req.session.userId;
  const todos = await todoModel.create({
    tasks,
    user_id: userId,
  });
  const savedTodos = await todos.save();
  res.json(savedTodos);
});

router.get("/api/note", middleware.isAuth, async (req, res) => {
  const userId = req.session.userId;
  const todos = await todoModel.find({ user_id: userId });
  res.json(todos);
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
  });
  res.redirect("/users/login");
});

module.exports = router;

