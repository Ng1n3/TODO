const todoModel = require('../model/todo.model');

const getAllbooks = () => {
    try {
        const alltodo = todoModel.find();
        return alltodo;
    } catch (error) {
        throw error
    }
}

const NewTodo = () => {
    try {
        const createTodo = todoModel.create()
    } catch (error) {
        throw error;
    }
}

const updateTodo = () => {
    try {
        const updatedTodo = todoModel.updateOne()
    } catch (error) {
        throw error;
    }
}

const deleteTask = (_id) => {
    try {
        todoModel.deleteOne({_id})
    } catch (error) {
        
    }
}

module.exports = {
    getAllbooks,
    NewTodo,
    updateTodo,
    deleteTask
}

