const puppeteer = require("puppeteer");
require("dotenv").config();

const LOGIN_URL = "https://www.americanexpress.com/en-us/account/login/";
const REWARDS_URL = "https://global.americanexpress.com/offers/eligible";

const USERNAME = process.env.AMEX_USERNAME;
const PASSWORD = process.env.AMEX_PASSWORD;

const OFFER_BUTTON_X_PATH =
  "//button[contains(@class, 'offer-cta') and @title='Add to Card']";

(async () => {
  // Login
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(LOGIN_URL);
  await page.type("#eliloUserID", USERNAME);
  await page.type("#eliloPassword", PASSWORD);

  const loginButton = await page.$("#loginSubmit");
  await loginButton.click();
  await page.waitForNavigation();

  // Go to collect offers
  await page.goto(REWARDS_URL);
  await new Promise((_) => setTimeout(_, 5000)); // wait a few sec for all offers to be populated

  const offerButtons = await page.$x(OFFER_BUTTON_X_PATH);

  for (let button of offerButtons) {
    await button.scrollIntoView();
    await button.click();
    await new Promise((_) => setTimeout(_, 2000));
  }

  await browser.close();
})();
