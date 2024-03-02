 const mongoose = require("mongoose");
// Todo schema
const todoSchema = new mongoose.Schema({
    userId: String,
    task: String,
    completed: Boolean ,
    token : String ,
  });

const Todo = mongoose.model("Todos",todoSchema); 
module.exports = Todo ;