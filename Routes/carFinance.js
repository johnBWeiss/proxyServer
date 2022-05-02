const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require('cheerio');
const req = require("express/lib/request");
const res = require("express/lib/response");

const title = []
const value = []
const result = []
const addedDetails = []
const itemArray = []
const items = {};
const gasPriceWithModel = []
const gasPrice = []
const carSiteNumberSearch = []



//https://www.icar.co.il/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F_%D7%A8%D7%9B%D7%91/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F_%D7%A7%D7%99%D7%94_%D7%A1%D7%99%D7%93_%D7%A1%D7%98%D7%99%D7%99%D7%A9%D7%9F_sw/
//https://www.icar.co.il/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F_%D7%A8%D7%9B%D7%91/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F_%D7%A1%D7%95%D7%96%D7%95%D7%A7%D7%99_%D7%A7%D7%A8%D7%95%D7%A1%D7%90%D7%95%D7%91%D7%A8/



// for (let p = 0; p < 350; p++) {

//     axios(`https://www.auto.co.il/fuel/${p}`)
//         .then(//https://pricelist.yad2.co.il/search.php?CarType=1&Manufactur=332&CarModel=7400&Year=2021
//             response => {
//                 let resp = response.data
//                 let $ = cheerio.load(resp)
//                 $('.section-title', resp).each(function () {
//                     carSiteNumberSearch.push($(this).text().trim())
//                 })

//                 console.log(carSiteNumberSearch);
//                 console.log(carSiteNumberSearch.length);
//                 items["קוד רכב"] = gasPriceWithModel
//                 items["כמה קוד"] = gasPriceWithModel.length



//                 // carSiteNumberSearch.


//             })

// }
router.get("/info", async (req, res) => {
    const search = []


    axios(`https://www.auto.co.il/fuel/122`)
        .then(//https://pricelist.yad2.co.il/search.php?CarType=1&Manufactur=332&CarModel=7400&Year=2021
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



    // axios("https://www.auto.co.il/fuel/138")
    //     .then(//https://pricelist.yad2.co.il/search.php?CarType=1&Manufactur=332&CarModel=7400&Year=2021
    //         response => {
    //             let resp = response.data
    //             let $ = cheerio.load(resp)
    //             $('td', resp).each(function () {
    //                 gasPrice.push($(this).text().trim())
    //             })
    //             // console.log(gasPrice[0], testD[1], "cool", testD[6], testD[7]);
    //             try {
    //                 for (let k = 0; k < gasPrice.length; k) {
    //                     if (!isNaN(Number(gasPrice[k + 1]))) {
    //                         gasPriceWithModel.push({ "דגם": gasPrice[k], "מחיר דלק": gasPrice[k + 1] })
    //                     }
    //                     k += 6
    //                 }
    //                 items["דגמים"] = gasPriceWithModel
    //             }
    //             catch (error) {
    //                 console.log(error);
    //             }




    // console.log(check);
    // check = check.split(" ")
    // console.log(check[0]);

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
    // items["מחיר"] = check[0]


    // })



    // console.log(gasPriceWithModel);

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

        // for (let i = 0; i < (title.length); i++) {
        //     result.push({ title: title[i], value: value[i] })
        // }
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

            res.send([items])

        }

        // console.log(result);

        // res.send(result);
        // console.log(value);
        // res.send(value)

    }).catch(err => {
        console.log(err.message, "this is the error");

        res.send(false)

    });
    // res.send(itemArray)


});


module.exports = router;