const { I } = inject();
require('dotenv').config();


// Add in your custom step files


Given('拜訪頁面', () => {
  I.amOnPage('/booking/admin');
});

Given('輸入在.ENV的信箱', () => {
  let email = process.env.ADMIN_EMAIL;
  I.fillField('email', email);
})

Given('輸入在.ENV的密碼', () => {
  let password = process.env.ADMIN_PASSWORD;
  I.fillField('password', password);
})

Given('在 {string} 登入', (env) => {
  I.click('Login');
  
  if (env == 'openstack') {
    // ssl avoiding.
    I.click({id: 'proceed-button'});
  }
})


Then('看到 {string}', (w) => {
  I.see(w);
})

Then('不看到 {string}', (w) => {
  I.dontSee(w);
})

Then('截圖路徑 {word}', (w) => {
  I.saveScreenshot(w);
});
