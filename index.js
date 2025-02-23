const puppeteer = require("puppeteer");
const { Solver } = require('@2captcha/captcha-solver');
const solver = new Solver('');
const fs = require("fs")
const { execFile } = require("child_process");

const BASE_URL = "https://www.racingandsports.com.au/";
// Chrome executable path on macOS
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const DEBUGGING_PORT = "9222";
const DEBUGGING_URL = `http://localhost:${DEBUGGING_PORT}/json/version`;

// Function to start Chrome with remote debugging
function launchChrome() {
    console.log("Launching Chrome...");
    return execFile(CHROME_PATH, [`--remote-debugging-port=${DEBUGGING_PORT}`], (error) => {
        if (error) {
            console.error("Error launching Chrome:", error);
        }
    });
}

// Function to get WebSocket Debugger URL
async function getWebSocketDebuggerUrl() {
    for (let i = 0; i < 10; i++) {  // Retry up to 10 times
        try {
            console.log(`Fetching debugger URL (Attempt ${i + 1})...`);
            const response = await fetch(DEBUGGING_URL);
            const data = await response.json();
            return data.webSocketDebuggerUrl;
        } catch (error) {
            console.log("Waiting for Chrome to start...");
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 sec before retrying
        }
    }
    throw new Error("Failed to retrieve WebSocket Debugger URL");
}

async function scrapeAllPages() {
    console.log("Launching browser...");

    launchChrome(); // Start Chrome
    const wsEndpoint = await getWebSocketDebuggerUrl(); // Get debugger URL

    console.log("Connecting Puppeteer to Chrome...");
    const browser = await puppeteer.connect({ browserWSEndpoint: wsEndpoint, defaultViewport: null });

    const [page] = await browser.pages()


    await page.goto(BASE_URL);



}


// Run the script
scrapeAllPages();
