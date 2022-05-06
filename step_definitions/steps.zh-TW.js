const { I } = inject();
require('dotenv').config();
const fs = require('fs')
// Add in your custom step files

Given('拜訪頁面', () => {
  I.amOnPage('/');
});

Then('看到目的地', (w) => {  
  I.see('目的地');
})

Then('輸入飯店 {string}', (w) => {
  I.click('目的地');
  I.fillField('#location-field-destination', w);
  I.wait(2)
  I.pressKey('ArrowDown');
  I.pressKey('Enter');

  I.click('搜尋');
})

Then('選擇入住時間 {int} {int} {int}', async (y, m, d) => { 
  let checkInDate = new Date(y, m, d);

  // add a day
  //TODO: 需要解決日期超過月份日問題
  checkInDate.setDate(checkInDate.getDate() + 1);
  let checkOutDate = new Date(checkInDate);
  
  checkInDate = `${y.toString()}-${m.toString().padStart(2,"0")}-${d.toString().padStart(2,"0")}`;
  checkOutDate = `${checkOutDate.getFullYear()}-${checkOutDate.getMonth().toString().padStart(2,"0")}-${checkOutDate.getDate().toString().padStart(2,"0")}`;
  let bookingDate = {checkInDate, checkOutDate};

  let uri = await I.executeScript((bookingDate) => {
    let urlParams = new URLSearchParams(window.location.search);
    urlParams.set('startDate', bookingDate.checkInDate);
    urlParams.set('endDate', bookingDate.checkOutDate);
    urlParams.set('d1', bookingDate.checkInDate);
    urlParams.set('d2', bookingDate.checkOutDate);

    return window.location.pathname + '?' + urlParams.toString();
  }, bookingDate);

  I.amOnPage(uri);
})

Then('選旅館', () => {
  I.see('選擇客房');

  I.click('選擇客房');

})

Then('查價錢', (w) => 
{
  I.switchToNextTab();
  I.closeOtherTabs();
  I.pressKey('End');
  I.pressKey('Home');
  I.pressKey('End');
  I.pressKey('Home');
  I.click('客房');

  I.waitForElement('div.uitk-layout-flex.uitk-layout-flex-justify-content-space-between.uitk-spacing.uitk-spacing-margin-blockend-three > h2', 3); //選擇客房 
  I.waitForElement('#Offers > div > div:nth-child(3) > div', 3); // all rooms

  let plains = I.executeScript(function (e) {
    var hotel_name = '';                  //  set your counter to 1
    var hotel = {};
    
    console.log('hotel Name', hotel_name = document.querySelector("div.uitk-spacing.uitk-spacing-padding-small-blockend-four.uitk-spacing-padding-large-blockstart-three > h1").innerHTML)

    var items = document.querySelector("#Offers > div > div:nth-child(3) > div").children.length;

    console.log('plans ', items)
    
    hotel.plains = [];
    hotel.name = hotel_name;

    const childNumReplaceString = '{@childNum}';
    const priceChildNumReplaceString = '{@priceChildNum}';
    
    var itemSelector = '#Offers > div > div:nth-child(3) > div > div:nth-child('+childNumReplaceString+')';
    var itemNameSelector = itemSelector + ' div.uitk-spacing.uitk-spacing-padding-small-blockend-half > h3';
    var itemPricesSelector = itemSelector + ' div.uitk-spacing.uitk-spacing-padding-block-three.uitk-spacing-border-blockend > div:nth-child(' + priceChildNumReplaceString + ')';
    
    
    for (item = 1; item <= items; item++) {
      console.log('now_item', item);

      var itemPrices = [];
      var planName = document.querySelector(itemNameSelector.replace(childNumReplaceString, item)).textContent;
      var planName = document.querySelector(itemNameSelector.replace(childNumReplaceString, item)).textContent;

      //未稅價
      let untaxedPrice = document.querySelector(itemPricesSelector.replace(childNumReplaceString, item).replace(priceChildNumReplaceString, 1));
      if (untaxedPrice == null){
        continue;
      }
      itemPrices.push(untaxedPrice.textContent);
      //其他費用與稅金
      itemPrices.push(document.querySelector(itemPricesSelector.replace(childNumReplaceString, item).replace(priceChildNumReplaceString, 2)).textContent);
      //總價
      itemPrices.push(document.querySelector(itemPricesSelector.replace(childNumReplaceString, item).replace(priceChildNumReplaceString, 3)).textContent);

      hotel.plains.push({
        'name': planName,
        'item_prices': itemPrices,
      })
    }

    console.log(hotel);

    return hotel;
  }).then(function (hotel) {
    console.log('hotel,', hotel);
    hotel.plains.forEach((h, hIndex) => {
      let output = hotel.name + ',' + h.name.replace(/(?:,)/g, '&') + ',';

      h.item_prices.forEach((i, index) => {
        output += i.replace(/(?:\r\n|\r|\n)/g, '<br>')
          .replace(/(?:,)/g, '')
          .replace(/(?:NT\$)/g, 'NT$,')
          .replace(/(?:<br>)/g, ',')
          .replace('晚NT$', ',晚NT$')
          .replace('稅金和其他費用', ',稅金和其他費用,')
          .replace('總價', ',總價,');
      });

      fs.writeFile('./hotels/hotel_' + hotel.name + '_.csv', output.replace(/(?:<br>)/g, ',') + '   \n', { flag: 'a+' }, err => {
        if (err) {
          console.error(err)
          return
        }
      })
    })
  });
  I.wait(1000)
})

