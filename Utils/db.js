const mongoose = require('mongoose');
const dbconn = async()=>{
try {
    await mongoose.connect(process.env.db_URL);
    console.log("db connected");
} catch (error) { 
    console.log(error);
    
}
}

module.exports = dbconn ;