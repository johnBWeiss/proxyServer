// packages import
const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const cheerio = require('cheerio');

const vgmUrl = 'https://www.find-car.co.il/car/private/74-938-33';


// enable CORS
app.use(cors());
// set the port on which our app wil run
// important to read from environment variable if deploying
const port = process.env.PORT || 5000;

// basic string route to prevent Glitch error
app.get("/", (req, res) => {
    // replace with a custom URL as required
    const backendUrl = "https://www.find-car.co.il/car/private/74-938-33";
    // return the data without modification
    axios.get(backendUrl).then(response => res.send(response.data));

});

// the route we're working with
app.get("/users:carNumber", (req, res) => {
    axios(`https://meshumeshet.com/c/${req.params.carNumber}`).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const title = []
        const value = []
        const result = []

        $('dt', html).each(function () {
            const titleData = $(this).text().trim()
            title.push(titleData)
        })
        $('dd', html).each(function () {
            const valueData = $(this).text().trim()
            value.push(valueData)
        })
        const items = {};
        const itemArray = []


        title.forEach((element, index) => {
            items[element] = value[index];
        });
        // console.log("value data", value);

        for (let i = 0; i < (title.length); i++) {
            result.push({ title: title[i], value: value[i] })
        }
        // let items = {};
        // for (let i = 0; i < (title.length); i++) {
        //     Object.assign(items, result[i])
        // }
        // console.log(items);
        itemArray.push(items)
        if (!value.length) {
            res.send(false)
        }
        else {
            res.send(itemArray)
        }

        // console.log(result);

        // res.send(result);
        // console.log(value);
        // res.send(value)
    }).catch(err => {
        console.log(err.message, "this is the error");

        res.send(false)

    });
});

// console text when app is running
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});