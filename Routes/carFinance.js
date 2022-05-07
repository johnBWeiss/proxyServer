const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require('cheerio');
const title = []
const value = []
const addedDetails = []
const itemArray = []
const items = {};


router.get("/info", async (req, res) => {
    const search = []


    axios(`https://www.auto.co.il/fuel/122`)
        .then(
            response => {
                let resp = response.data
                let $ = cheerio.load(resp)
                $('.section-title', resp).each(function () {
                    search.push($(this).text().trim())
                })

                console.log(search);
                console.log(search.length);
                res.send(search)
            })

})


router.get("/:carNumber", (req, res) => {


    axios(`https://meshumeshet.com/c/${req.params.carNumber}`).then(response => {
        const html = response.data
        const $ = cheerio.load(html)


        $('.carPageShowMoreDetails', html).each(function () {
            const testData = $(this).text().split(":")
            addedDetails.push(testData)
            // console.log(testData, 'testdata');
        })

        items[addedDetails[0][0]] = addedDetails[0][1] // extracting engine gas type
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

        itemArray.push(items)
        if (!value.length) {
            res.send(false)
        }
        else {

            res.send([items])

        }

        // res.send(value)

    }).catch(err => {
        console.log(err.message, "this is the error");

        res.send(false)

    });

});


module.exports = router;