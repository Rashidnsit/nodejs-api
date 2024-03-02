const express = require("express");
const dotenv = require('dotenv');
const router = require('./Routes/UserRoutes');
const dbconn = require('./Utils/db.js');
dotenv.config();
dbconn();
const app = express();


// middlewere
app.use(express.json());
app.use("/api",router);
app.listen(process.env.PORT, () => {
    console.log('Server is running on port:' + process.env.PORT);
});

