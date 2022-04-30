const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require('cheerio');



router.get("/:carNumber", (req, res) => {
    axios(`https://meshumeshet.com/c/${req.params.carNumber}`).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const title = []
        const value = []
        const result = []
        const addedDetails = []
        // const engineAndGear = {}
        const items = {};
        const itemArray = []

        $('.carPageShowMoreDetails', html).each(function () {
            const testData = $(this).text().split(":")
            addedDetails.push(testData)
            console.log(testData, 'testdata');
        })

        // engineAndGear[addedDetails[0][0]] = addedDetails[0][1]
        // console.log(engineAndGear);
        console.log(addedDetails, 'addeddetails')

        items[addedDetails[0][0]] = addedDetails[0][1] // extracting engine gas type
        items[addedDetails[1][0]] = addedDetails[1][1] // extracting current ownership

        items[addedDetails[1][0]] = addedDetails[1][1] // extracting gear type

        $('dt', html).each(function () {
            const titleData = $(this).text().trim()
            title.push(titleData)
        })
        $('dd', html).each(function () {
            const valueData = $(this).text().trim()
            value.push(valueData)
        })



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
            console.log(itemArray);
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


module.exports = router;