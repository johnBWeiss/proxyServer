const express = require("express");
const router = express.Router();
const puppeteer = require('puppeteer');
const minimal_args = [
    '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-speech-api',
    '--disable-sync',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain',
];


async function screenShot(id, link, browser) {
    console.log('starting %s', id);
    console.time(id)
    let page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(link);
    let image = await page.screenshot({ type: 'jpeg', quality: 10, omitBackground: true, encoding: 'base64' });
    // await page.close();
    console.timeEnd(id)

    return 'data:image/jpeg;base64,' + image
}


router.get('/links/:searchWord', async (req, res) => {

    try {
        const searchQuery = req.params.searchWord;
        const browser = await puppeteer.launch({ headless: true, args: minimal_args });
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
        res.send(searchResults);

    } catch (error) {
        res.send(error.message)

    }


})

router.post('/screenShot', async (req, res) => {

    try {
        const browser = await puppeteer.launch({ headless: true, args: minimal_args, });
        const page = await browser.newPage();
        await page.goto(req.body.link);
        let image = await page.screenshot({ type: 'jpeg', quality: 10, omitBackground: true, encoding: 'base64' });
        // await browser.close();
        image = 'data:image/jpeg;base64,' + image
        res.send(image);
    } catch (error) {
        res.send(error.message)
    }

})

router.get('/google/:searchWord', async (req, res) => {

    try {
        console.time('start')
        const searchQuery = req.params.searchWord;
        const browser = await puppeteer.launch({ headless: true, args: minimal_args });
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

        const imagesMultiple = []
        const arrayOfImages = []
        await Promise.all([screenShot(0, searchResults[0].link, browser), screenShot(1, searchResults[1].link, browser),
        screenShot(2, searchResults[2].link, browser)
        ])
            .then((values) => {
                imagesMultiple.push(...values)

            });
        for (let i = 0; i < 3; i++) {
            searchResults[i].imageCode = imagesMultiple[i]
            arrayOfImages.push(searchResults[i])
        }
        // await browser?.close();
        console.timeEnd('start')

        res.send(arrayOfImages)

    } catch (error) {
        res.send(error.message)

    }


})
module.exports = router;


