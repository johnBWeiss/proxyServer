// packages import
const express = require("express");
const app = express();
const cors = require("cors");
const { connectDB } = require("./Models/modelsIndex");
const { carFinance } = require("./Routes/router");


require("dotenv").config();

const vgmUrl = 'https://www.find-car.co.il/car/private/74-938-33';


// enable CORS
app.use(cors());

const port = process.env.PORT || 4000

app.use("/carFinance", carFinance);


//Connect the Database
connectDB().then(() => {
    console.log("Connected to DB successfully");
});



// console text when app is running
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});