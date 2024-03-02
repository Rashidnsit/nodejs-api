const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    email: {
        type : String ,
        required : true ,
    },
    username: {
        type : String ,
        required : true ,
    },
    password: {
        type : String ,
        required : true ,
    },
    token : {
        type : String ,
        default : "",
    },
     userId : {
        type : String ,
        
    }
   
    
},{
    timestamps: true,
  });

const usermodel = mongoose.model("users",userSchema); 
module.exports = usermodel ;