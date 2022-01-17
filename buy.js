const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200,
    defaultViewport: {
      width: 1080,
      height: 720,
    },
  });
  const page = await browser.newPage();
  await page.goto(
    'https://www.nike.com/cn/t/lebron-19-ep-%E7%94%B7-%E5%A5%B3%E7%AF%AE%E7%90%83%E9%9E%8B-0zNCCQ/DC9341-400'
  );
  await (await page.$('#buyTools > div:nth-child(1) > fieldset > div > div:nth-child(8) > label')).click();
  // await page.click('#floating-atc-wrapper > div > button.ncss-btn-primary-dark.btn-lg.add-to-cart-btn');
  // 添加到购物车
  await page.evaluate(() => {
    document.querySelector('[aria-label=加入购物车]').click();
  });

  // 结算
  // await (await page.$('.norecs-container>button:nth-child(2)')).click();
  const cookies = await page.cookies();

  // 进入购物车
  await page.goto('https://www.nike.com/cn/checkout');
  for (let cookie in cookies) {
    await page.setCookie(cookie);
  }
  await page.goto('https://www.nike.com/cn/checkout');
  // 填写信息
  await page.evaluate(x => {
    document.getElementById('lastName').value = '叶';
    document.getElementById('firstName').value = '东东';
    document.getElementById('state').value = '浙江省';
    document.getElementById('city').value = '杭州市';
    document.getElementById('county').value = '余杭区';
    document.getElementById('address1').value = '五常街道盛奥铭座';
    document.getElementById('county').value = '余杭区';
    document.getElementById('email').value = 'yedongdong2019@163.com';
    document.getElementById('phoneNumber').value = '15950430286';
    document.querySelector('button[data-attr= saveAddressBtn]').click();
  }, 7);

  await browser.close();
})();
