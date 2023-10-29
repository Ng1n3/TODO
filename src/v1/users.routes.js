const express = require("express");
const router = express.Router();
const middleware = require("../middleware/users.middleware");
const controller = require("../controller/users.controller");



router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/signup", middleware.ValidUserCreation, controller.createUser);

router.post("/login", middleware.loginValidation, controller.loginUser);

router.get("/note", middleware.isAuth, (req, res) => {
  res.render("note");
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
  });
  console.log("PING!");
  res.redirect("/users/login");
});

module.exports = router;
