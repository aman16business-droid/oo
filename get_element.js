import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // click the account button to open auth modal
  await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Account"]')
    if (btn) btn.click();
  });
  
  // wait for modal animation
  await new Promise(r => setTimeout(r, 1000));

  const selector = 'div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2)';
  
  try {
    const html = await page.$eval(selector, el => ({ tag: el.tagName, className: el.className, text: el.textContent }));
    console.log("Found after opening modal:", html);
  } catch(e) {
    console.log("Not found.");
  }
  await browser.close();
})();
