const puppeteer = require("puppeteer");

const BASE_URL = "https://www.racingandsports.com.au/";

async function scrapeAllPages() {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({
        headless: false,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        defaultViewport: null
    });

    const page = await browser.newPage();

    await page.goto(BASE_URL, { waitUntil: "networkidle2", timeout: 60000 });
}

// Run the script
scrapeAllPages();