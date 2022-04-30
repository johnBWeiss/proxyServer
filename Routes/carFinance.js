const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require('cheerio');

const title = []
const value = []
const result = []
const addedDetails = []
const items = {};
const itemArray = []
//https://www.icar.co.il/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F_%D7%A8%D7%9B%D7%91/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F_%D7%A7%D7%99%D7%94_%D7%A1%D7%99%D7%93_%D7%A1%D7%98%D7%99%D7%99%D7%A9%D7%9F_sw/
//https://www.icar.co.il/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F_%D7%A8%D7%9B%D7%91/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F_%D7%A1%D7%95%D7%96%D7%95%D7%A7%D7%99_%D7%A7%D7%A8%D7%95%D7%A1%D7%90%D7%95%D7%91%D7%A8/
router.get("/:carNumber", (req, res) => {
    axios("https://www.icar.co.il/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F_%D7%A8%D7%9B%D7%91/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F_%D7%A1%D7%95%D7%96%D7%95%D7%A7%D7%99_%D7%A7%D7%A8%D7%95%D7%A1%D7%90%D7%95%D7%91%D7%A8/")
        .then(//https://pricelist.yad2.co.il/search.php?CarType=1&Manufactur=332&CarModel=7400&Year=2021
            response => {
                let priceData = []
                let resp = response.data
                let $ = cheerio.load(resp)
                let check = $('.pl_versions_td', resp).text()
                check = check.split(" ")
                console.log(check[0]);

                // let check = $('#fieldprice', resp).text()
                // console.log(typeof (check));
                // for (let i = 0; i < check.length; i++) {
                //     console.log(typeof (Number(check.charAt(i))));
                //     if (!isNaN(Number(check.charAt(i)))) { items["מחיר"] += check.charAt(i) }
                // }
                // console.log(items["מחיר"]);
                // items[priceData[check]] = check
                // extracting price
                // console.log(items);
                // let content = check.toString().replace(/\t/g, '').replace(/\r/g, '').replace(/\n/g, '').replace('מחיר', '').trim()
                items["מחיר"] = check[0]


            })



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