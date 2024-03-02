const usermodel = require('../Models/userModels');
const bcryptjs = require('bcryptjs');
const { Validator } = require("node-input-validator");
const jwt = require('jsonwebtoken');
const Todo = require('../Models/todoModel');
const { request } = require('express');

const register = async (req, res) => {
    try {

        const val = new Validator(req.body, {
            email: "required|email",
            password: "required",
            username: "required|string",

        });
        const matched = await val.check();

        if (!matched) {
            return res.status(422).json({ status: 422, error: val.errors });
        }
        const { email, password, username } = req.body;

        const existinguser = await usermodel.findOne({ email });
        if (existinguser) {
            res.status(400).json({ messege: "user alredy exist" });
        }
        //hash password 
        const hashhpassword = await bcryptjs.hash(password, 10);
        // create new user  
        const newuser = usermodel({ email, password: hashhpassword, username });
        await newuser.save();
        
        res.status(200).json({ messege: "registered sucssesfull !!", user: newuser });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ messege: "intarnal server errror" });
    }

};

const login = async (req, res) => {
    try {
        const val = new Validator(req.body, {
            email: "required|email",
             password: "required", 
           
            
        });
        const matched = await val.check();

        if (!matched) {
            return res.status(422).json({ status: 422, error: val.errors });
        }

        const { email, password } = req.body;
        const user = await usermodel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password !!" });
        } else {
          
               const token = jwt.sign({ userId: user._id }, 'thisismysecretkey');
                // res.json({ token });


   console.log("login token :"+token); 
   global.logintoken = token ;



            return res.status(200).json({ message: "Login successful!!", user  , token : token});
        }
    } catch (error) {
        console.error("Error in login function:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};


// const forgotpassword = async (req, res) => {
//     try {
//         console.log("Starting forget  function...");

//         const email = req.body.email;
//         const userdata = await usermodel.findOne({ email });

//         if (userdata) {

//             const randomString = randomstring.generate();
//             await usermodel.updateOne({ email: email }, { $set: { token: randomString } });
//             sendresetPasswordMail(userdata.username, userdata.email, randomString);
//             console.log(userdata.username);
//             console.log(userdata.email);
//             console.log(randomString);
//             console.log(" forget password succses function...");

//             res.status(200).json({

//                 "messege": "Check your mail and re set password",
//             });
//         } else {
//             res.status(200).json({

//                 "messege": "User Does not Exist!!",
//             });
//         }


//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ "error": "Internal server error" });

//     }
// };
// RESET PASSWORd
const forgotpassword = async (req, res) => {
    try {
      const { email, newPassword,  } = req.body;
      if (!email || !newPassword ) {
        return res.status(500).send({
          success: false,
          message: "Please Privide All Fields",
        });
      }
      const user = await usermodel.findOne({ email });
      if (!user) {
        return res.status(500).send({
          success: false,
          message: "User Not Found ",
        });
      }
      //hashing password
      var salt = bcryptjs.genSaltSync(10);
      const hashedPassword = await bcryptjs.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
      res.status(200).send({
        success: true,
        message: "Password Reset SUccessfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "eror in PASSWORD RESET API",
        error,
      });
    }
  };

  const authenticateUser = (reqest, res, next) => {
    const token = reqest.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
    try {
      const decoded = jwt.verify(token, 'thisismysecretkey');
      reqest.userId = decoded.userId; 
       this.idofposttodo = request.userId ;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
  


  const posttodo =  async  (req, res) => { 
    console.log("stating ---------------- post todo");
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
    try {
      const decoded = jwt.verify(token,'thisismysecretkey');
      req.userId = decoded.userId;  
      console.log('UserId in posttodo:', req.userId);

      global.gettodobyid = req.userId ;
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  try {
 
  const validation = new Validator(req.body, {
    task: 'required|string',
    completed: 'required|boolean',
  });

  // Run validation
  const passed = await validation.check();

  if (!passed) {
    return res.status(400).json({ errors: validation.errors });
  }

    const { task, completed } = req.body;
    if (!task) {
      return res.status(400).json({ message: 'Task is required' });
    }

    const todo = new Todo({ userId: req.userId, task, completed });
    await todo.save();
    console.log("ending ---------------- post todo");

    res.json({ message: 'Todo added successfully' });
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
  };

  
  const gettodo = async (req, res) => {
    console.log("Starting ----------------");
  
    try {
      // Check if global.logintoken is defined
      if (!global.logintoken) {
        console.error('No login token provided');
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const decoded = jwt.verify(global.logintoken, 'thisismysecretkey');
      const userId = decoded.userId;
  
      // Log or check the value of userId to ensure it's not undefined
      console.log('UserId:', userId);
  
      if (!userId) {
        console.error('UserId is undefined');
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      // Use userId directly instead of global.gettodobyid
      const todos = await Todo.find({ userId });
      res.json(todos);
    } catch (error) {
      console.error('Error getting todos:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  
    console.log("Ending ----------------");
  };
// const  gettodo = async (req, res) => {
//   console.log("stating ----------------");
//   const token = global.logintoken ;
//   const decoded = jwt.verify(token,'thisismysecretkey');
//   req.userId = decoded.userId;   

//   console.log(global.gettodobyid); 
//   const byid = global.gettodobyid ; 
//   console.log("by id :"+byid);
//   try {
    
//     const todos = await Todo.find({userId : decoded.userId});
   
//     res.json(todos);
//   } catch (error) {
//     console.error('Error getting todos:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
//   console.log("ending ----------------");
// };

module.exports = { register, login, forgotpassword ,posttodo ,gettodo , authenticateUser};