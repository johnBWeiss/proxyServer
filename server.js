// packages import
const express = require("express");
const app = express();
const cors = require("cors");
const { connectDB } = require("./Models/modelsIndex");
const { carFinance } = require("./Routes/router");
const { screenshots } = require("./Routes/router");
const bodyParser = require("body-parser");
const path = require('path')



app.use(bodyParser.json())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))
require("dotenv").config();


// enable CORS
app.use(cors('*'));

const port = process.env.PORT || 5000

app.use("/carFinance", carFinance);
app.use("/screenshots", screenshots);


//Connect the Database
// connectDB().then(() => {
//     console.log("Connected to DB successfully");
// });



// console text when app is running
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});