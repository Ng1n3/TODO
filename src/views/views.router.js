const express = require("express");
const Usercontroller = require("../controller/users.controller");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  Usercontroller.createUser();
});

module.exports =  router ;
