import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log("Body length:", bodyText.length);
  if (bodyText.length < 100) {
    console.log("Body content:", bodyText);
  }
  await browser.close();
})();
