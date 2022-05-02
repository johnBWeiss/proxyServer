const express = require("express");
const router = express.Router();
const axios = require("axios");
const puppeteer = require('puppeteer');
const req = require("express/lib/request");


async function screenShot(searchResults) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto(searchResults);
    let image = await page.screenshot({ path: 'buddy-screenshot.png' });

    await browser.close();
    console.log(image);
    image = image.toString('base64')
    // return { ...searchResults, imageCode: image }
    return image

}

router.post('/postman', async (req, res) => {
    try {
        console.log(req.body);
        res.send(req.body)
    } catch (error) {

        res.send(error)
    }
})

router.post('/screenShot', async (req, res) => {

    try {
        console.log(req.body);
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.goto(req.body.link);
        let image = await page.screenshot({ path: 'buddy-screenshot.png' });

        await browser.close();
        // console.log(image);
        image = image.toString('base64')
        image = 'data:image/jpeg;base64,' + image
        res.send(image);
    } catch (error) {
        console.log(error.message);
    }





})

router.get('/google/:searchWord', async (req, res) => {

    console.time('start')
    let browser;
    const searchQuery = req.params.searchWord;

    browser = await puppeteer.launch();
    const [page] = await browser.pages();
    await page.goto("https://www.google.com/", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[aria-label="Search"]', { visible: true });
    await page.type('input[aria-label="Search"]', searchQuery);
    await Promise.all([
        page.waitForNavigation(),
        page.keyboard.press("Enter"),
    ]);
    await page.waitForSelector(".LC20lb", { visible: true });
    const searchResults = await page.$$eval(".LC20lb", els =>
        els.map(e => ({ title: e.innerText, link: e.parentNode.href, imageCode: '' }))
    );
    console.log(searchResults);
    const arrayOfImages = []
    for (let i = 0; i < 6; i++) {
        test = await screenShot(searchResults[i].link)
        // test = test.toString('base64')
        test = 'data:image/png;base64,' + test

        searchResults[i].imageCode = test
        arrayOfImages.push(searchResults[i])
    }

    browser?.close();
    console.timeEnd('start')
    res.send(arrayOfImages)
})
module.exports = router;


