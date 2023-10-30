const todoService = require("../services/todo.service");
const todoModel = require("../model/todo.model");

const getAllTodo = (req, res) => {
    console.log("PING!!")
    console.log(req.username);
  todoModel
    .find()
    .then((todo) => {
      res.render("note", { user: req.user, todo });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

const getTodo = (req, res) => {
  const id = req.params.id;
  todoModel
    .findById(id)
    .then((todo) => {
      res.status(200).send(todo);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
};

const createTodo = (req, res) => {
  const todoCreated = req.body;
  todoModel
    .create(todoCreated)
    .then((todo) => {
      res.status(201).send(todo);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const updateTodo = (req, res) => {
  const id = req.params.id;
  const todos = req.body;
  todoModel.findByIdAndUpdate(id, todos, { new: true }).then((newTodo) => {
    res.status(200).send(newTodo);
  }).catch(err => {
    res.status(500).send(err)
  });
};

const deleteTodo = (req, res) => {
    const id = req.params.id
    todoModel.findByIdAndRemove(id).then(todo => {
        res.status(200).send(todo)
    }).catch(err => {
        res.status(500).send(err)
    })
}


module.exports = {
    getAllTodo,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo
}