const express = require("express");
const db = require("./db/db");
require("dotenv").config({ path: "./env" });
const path = require("path");
const userRoute = require("./v1/users.routes");
// const viewRouter = require('./views/views.router')
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
db.connect();
const app = express();
const PORT = process.env.PORT || 4002;

const store = new MongoStore({
  uri: process.env.MONGO_URL,
  collection: "mySessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, //1hour
    store,
  })
);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

/* Middlewares */
app.use(express.static(__dirname + "/public"));
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/views', viewRouter);
app.get("/", (req, res) => {
  return res.redirect("/users/login");
});
app.use("/users", userRoute);

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/login");
  }
};

app.listen(PORT, () => {
  console.log(`App is listening on localhost://${PORT}`);
});

module.exports = { isAuth };
