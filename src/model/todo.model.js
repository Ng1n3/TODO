const mongoose = require('mongoose');
const shortId = require('shortid');
const UserModel = require('./users.model');

const Schema = mongoose.Schema;
const todoSchema = new Schema({
    _id: {
        type: String,
        default: shortId.generate
    },
    created_at: {type: Date, default: new Date()},
    user_id: {type: String, ref: 'UserModel'},
    tasks: {type: String, required: true},
    state: {type: Boolean, default: false}
    
})

const todoModel = mongoose.model("todos", todoSchema);
module.exports = todoModel;