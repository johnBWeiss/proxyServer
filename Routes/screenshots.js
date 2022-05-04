const express = require("express");
const router = express.Router();
const axios = require("axios");
const puppeteer = require('puppeteer');
const req = require("express/lib/request");


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
console.time('multi')
// let testArray = multiple([{ link: 'https://www.google.com/' }, { link: 'https://www.walla.co.il/' }, { link: 'https://www.ynet.co.il/home/0,7340,L-8,00.html', }])
// if (testArray.length > 1) {
//     console.log(testArray);

//     console.timeEnd('multi')
// }

async function multiple(searchResults) {

    console.time('multiple')
    try {
        let image1 = screenShot(searchResults[0].link)
        let image2 = screenSho(searchResults[1].link)
        let image3 = screenSh(searchResults[2].link)
        if (image1.length > 0 && image2.length > 0 && image3.length > 0) {
            image1 = 'data:image/png;base64,' + image1
            image2 = 'data:image/png;base64,' + image2
            image3 = 'data:image/png;base64,' + image3


            console.timeEnd('multiple')
            return [image1, image2, image3]
        }
    } catch (error) {
        console.log(error);
    }

}
// cyprus
// console.time('check')
// let image = screenShot('https://www.google.com/search?q=cyprus+screensht&rlz=1C1CHZN_enIL951IL951&oq=cyprus+screensht&aqs=chrome..69i57j0i10i13i30.3207j0j4&sourceid=chrome&ie=UTF-8')
// if (image.length > 0) {
//     console.log(image);

//     console.timeEnd('check')
// }


// screenShot('https://www.google.com/').then(await screenShot('https://www.google.com/')).then(await screenShot('https://www.google.com/'))

async function screenShot(searchResults) {
    console.time('1')
    const browser = await puppeteer.launch({ headless: true, args: minimal_args });
    const page = await browser.newPage();
    await page.goto(searchResults);
    let image = await page.screenshot({ type: 'jpeg', quality: 20, omitBackground: true, encoding: 'base64' });
    image = 'data:image/jpeg;base64,' + image

    await browser.close();
    // image = image.toString('base64')
    // return { ...searchResults, imageCode: image }
    console.timeEnd('1')
    console.log(image.substring(0, 3));
    return image

}
async function screenSho(searchResults) {
    console.time('2')
    const browser = await puppeteer.launch({ headless: true, args: minimal_args });
    const page = await browser.newPage();
    await page.goto(searchResults);
    let image = await page.screenshot({ type: 'jpeg', quality: 20, omitBackground: true, encoding: 'base64' });
    image = 'data:image/jpeg;base64,' + image

    await browser.close();
    // image = image.toString('base64')
    // return { ...searchResults, imageCode: image }
    console.timeEnd('2')
    console.log(image.substring(0, 3));

    return image

}

async function screenSh(searchResults) {
    console.time('3')
    const browser = await puppeteer.launch({ headless: true, args: minimal_args });
    const page = await browser.newPage();
    await page.goto(searchResults);
    let image = await page.screenshot({ type: 'jpeg', quality: 20, omitBackground: true, encoding: 'base64' });
    image = 'data:image/jpeg;base64,' + image

    await browser.close();
    // image = image.toString('base64')
    // return { ...searchResults, imageCode: image }
    console.timeEnd('3')
    console.log(image.substring(0, 3));

    return image

}


// router.post('/screenShot', async (req, res) => {

//     try {
//         console.log(req.body);
//         const browser = await puppeteer.launch({ headless: true, args: minimal_args });
//         const page = await browser.newPage();
//         await page.goto(req.body.link);
//         let image = await page.screenshot({ path: 'buddy-screenshot.png' });
//         await browser.close();
//         // console.log(image);
//         image = image.toString('base64')
//         // image = 'data:image/jpeg;base64,' + image
//         res.send(image);
//     } catch (error) {
//         console.log(error.message);
//     }





// })

router.get('/google/:searchWord', async (req, res) => {


    try {
        console.time('start')
        let browser;
        const searchQuery = req.params.searchWord;
        browser = await puppeteer.launch({ headless: true, args: minimal_args, userDataDir: './dataCach' });
        const [page] = await browser.pages();
        await page.goto("https://www.google.com/", { waitUntil: "domcontentloaded" });
        await page.waitForSelector('input[aria-label="Search"]', { visible: true });
        await page.type('input[aria-label="Search"]', searchQuery);
        await Promise.all([
            page.waitForNavigation(),
            page.keyboard.press("Enter"),
        ]);
        console.time('getting links')

        await page.waitForSelector(".LC20lb", { visible: true });
        const searchResults = await page.$$eval(".LC20lb", els =>
            els.map(e => ({ title: e.innerText, link: e.parentNode.href, imageCode: '' }))
        );
        console.timeEnd('getting links')

        browser?.close();

        // console.log(searchResults);


        const imagesMultiple = []
        // [screenShot(searchResults[0]), screenShot(searchResults[1]), screenShot(searchResults[3])]

        // await screenShot(searchResults[0].link).then(await screenShot(searchResults[1].link)).then(await screenShot(searchResults[2].link))


        // imagesMultiple[1] = await screenShot(searchResults[1].link)
        // imagesMultiple[2] = await screenShot(searchResults[2].link)

        // const imagesMultiple = await multiple(searchResults)
        // const imagesMultiple = screenShot(searchResults[0].link)

        // if (imagesMultiple[0] && imagesMultiple[1] && imagesMultiple[2]) {
        //     console.log(imagesMultiple);
        // if (searchResults[0].length > 0 && searchResults[1].length > 0 && searchResults[2].length > 0) {
        const arrayOfImages = []
        console.time('promiseAll')
        await Promise.all([screenShot(searchResults[0].link), screenSho(searchResults[1].link), screenSh(searchResults[2].link)]).then((values) => {
            ; imagesMultiple.push(...values)
            console.timeEnd('promisAll')
        });
        // imagesMultiple[0] = screenShot(searchResults[0].link)
        // imagesMultiple[1] = screenSho(searchResults[1].link)
        // imagesMultiple[2] = screenSh(searchResults[2].link)

        // console.log(imagesMultiple);
        for (let i = 0; i < 3; i++) {
            console.time("loop")
            // test = await screenShot(searchResults[i].link)
            // test = test.toString('base64')
            // test = 'data:image/png;base64,' + test
            searchResults[i].imageCode = imagesMultiple[i]

            // searchResults[i].imageCode = imagesMultiple[i]
            arrayOfImages.push(searchResults[i])
        }

        console.timeEnd('loop')

        console.timeEnd('start')
        res.send(arrayOfImages)
    } catch (error) {
        console.log(error);
        res.send([{ imageCode: '' }])

    }


})
module.exports = router;


