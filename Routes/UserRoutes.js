const express = require('express');
const {login,register,forgotpassword ,posttodo ,gettodo ,authenticateUser} =require("../Controllers/authController");
const router = express.Router();

router.post('/register' , register);
router.post('/login' , login);
router.post('/forgot_password', forgotpassword); 
router.post('/post_todo',posttodo,authenticateUser );
router.get('/get-todo' , gettodo , authenticateUser)
module.exports = router ;