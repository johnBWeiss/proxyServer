const puppeteer = require('puppeteer');

let browser;
(async () => {
    const searchQuery = "stack overflow";

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
        els.map(e => ({ title: e.innerText, link: e.parentNode.href }))
    );
    console.log(searchResults);
    screen(searchResults)
})()
    .catch(err => console.error(err))
    .finally(() => { browser?.close(); })
    ;

async function screen(searchResults) {
    console.log(searchResults);

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    console.log(searchResults);
    const page = await browser.newPage(); await page.goto(searchResults[0].link);
    let image = await page.screenshot({ path: 'buddy-screenshot.png' }); console.log(image); await browser.close();
}