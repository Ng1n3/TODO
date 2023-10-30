const express = require("express");
require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const UserModel = require("../model/users.model");
const bcrypt = require('bcryptjs');

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));

const createUser = async (req, res) => {
  const userInput = req.body;

  const existingUser = await UserModel.findOne({
    email: userInput.email,
  });

  if (existingUser) {
    res.status(409).send({
      status: "FAILED",
      message: "User already created",
    });
  }
  const hashedPwd = await bcrypt.hash(userInput.password, 12);

  const user = await UserModel.create({
    username: userInput.username,
    email: userInput.email,
    password: hashedPwd,
    gender: userInput.gender,
    contact: userInput.contact,
    phone_number: userInput.phone_number
  });

  req.session.username = user.username;
  req.session.userId = user._id;
  req.session.isLoggedIn = true;
  await user.save();
  res.redirect("note");
};

const loginUser = async (req, res) => {
  const {email, password} = req.body;
  const user = await UserModel.findOne({
    email,
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(422).json({
      message: "Email or password is not correct",
    });
  }
  req.session.username = user.username;
  req.session.userId = user._id;
  req.session.isLoggedIn = true;
  console.log(req.session);
  res.redirect('/users/note');
};

module.exports = { createUser, loginUser };
