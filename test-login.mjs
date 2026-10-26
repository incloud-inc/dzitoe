import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

  console.log('Navigating to http://localhost:3001/login...');
  await page.goto('http://localhost:3001/login');
  
  console.log('Waiting 5 seconds...');
  await page.waitForTimeout(5000);
  
  const bodyHandle = await page.$('body');
  const html = await page.evaluate(body => body.innerHTML, bodyHandle);
  console.log('Body length after 5 seconds:', html.length);
  
  await browser.close();
})();
