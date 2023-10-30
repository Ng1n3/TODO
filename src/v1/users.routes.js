const express = require("express");
const router = express.Router();
const middleware = require("../middleware/users.middleware");
const controller = require("../controller/users.controller");
const todoModel = require("../model/todo.model");
const userModel = require("../model/users.model");

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/signup", middleware.ValidUserCreation, controller.createUser);

router.post("/login", middleware.loginValidation, controller.loginUser);

router.get("/note", middleware.isAuth, async (req, res) => {
  const todos = await todoModel.find({ user_id: req.session.userId });
  const user = await userModel.find({ username: req.session.username });
  console.log(user);
  console.log(todos);

  res.render("note", { todos, user });
});

router.post("/note", middleware.isAuth, async (req, res) => {
  const { tasks, state } = req.body;
  const todos = await todoModel.create({ user_id: req.session.userId, tasks, state });
  const user = await userModel.find({ username: req.session.username });
  await todos.save();

  res.redirect(303, "/users/note");
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
  });
  res.redirect("/users/login");
});

module.exports = router;
