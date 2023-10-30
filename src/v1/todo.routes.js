const express = require('express');
const router = express.Router();
const controller = require('../controller/todos.controller');
const middleware = require('../middleware/users.middleware');
// router.use('/users', require('./users.routes'))

router.get('/todo', middleware.isAuth, controller.getAllTodo);
router.post('/:id', controller.createTodo);
router.get('/:id', controller.getTodo);
router.delete('/:id', controller.deleteTodo);


module.exports = router;