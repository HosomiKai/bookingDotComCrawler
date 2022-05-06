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
  I.pressKey('End');

  I.wait(10);
  // I.waitForVisible('#Offers > div > div:nth-child(3) > div', 3);

  I.see('選擇客房');

  let plains = I.executeScript(function (e) {
    var hotel_name = '';                  //  set your counter to 1

    console.log('hotel Name', hotel_name = document.querySelector("#app-layer-base > div > main > div > div > div.uitk-layout-flex-item.main-body.m-t-margin-two.l-t-margin-three.xl-t-margin-three > section > div.infosite__content.infosite__content--details > div.uitk-layout-grid.uitk-layout-grid-columns-3 > div:nth-child(2) > div:nth-child(1) > div > div.uitk-layout-grid.uitk-layout-grid-columns-small-1.uitk-layout-grid-columns-medium-1.uitk-layout-grid-columns-large-12 > div.uitk-spacing.uitk-spacing-padding-large-inlineend-three.uitk-layout-grid-item.uitk-layout-grid-item-columnspan.uitk-layout-grid-item-columnspan-small-1.uitk-layout-grid-item-columnspan-medium-1.uitk-layout-grid-item-columnspan-large-8 > div.uitk-spacing.uitk-spacing-padding-small-blockend-four.uitk-spacing-padding-large-blockstart-three > h1").innerHTML)
    
    var items = document.querySelector("#Offers > div > div:nth-child(3) > div").children.length;

    console.log('plans ', items)
    
    var hotel = {};
    hotel.plains = [];
    hotel.name = hotel_name;

    const childNumReplaceString = '{@childNum}';
    const priceChildNumReplaceString = '{@priceChildNum}';
    
    var itemSelector = '#Offers > div > div:nth-child(3) > div > div:nth-child('+childNumReplaceString+')';
    var itemNameSelector = itemSelector + ' > div:nth-child(1) > div.uitk-spacing.uitk-spacing-padding-blockstart-three.uitk-spacing-padding-inline-three > div.uitk-spacing.uitk-spacing-padding-small-blockend-half > h3';
    var itemPricesSelector = itemSelector + ' > div.uitk-spacing.uitk-spacing-padding-inline-three.uitk-spacing-padding-blockend-three.uitk-layout-flex-item-align-self-stretch.uitk-layout-flex-item > div > div > div:nth-child(1) > div > div.uitk-spacing.uitk-spacing-padding-blockstart-one > div > div > div > div.uitk-spacing.uitk-spacing-padding-block-three.uitk-spacing-border-blockend > div:nth-child(' + priceChildNumReplaceString + ')';
    
    
    for (item = 1; item <= items; item++) {
      console.log('now_item', item);

      var itemPrices = [];

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
      h.item_prices.forEach((i, iIndex) => {
        output = hotel.plains[hIndex].item_prices[iIndex].replace(/(?:\r\n|\r|\n)/g, '<br>');
        output = output.replace(/(?:,)/g, '');
        output = output.replace(/(?:NT\$)/g, 'NT$,');
        output = hotel.name + ',' + hotel.plains[hIndex].name.replace(/(?:,)/g, '&') + ',' + output
        output = output.replace(/(?:<br>)/g, ',');
        fs.writeFile('./hotels/hotel_'+hotel.name+'_.csv', output + '   \n', { flag: 'a+' }, err => {
          if (err) {
            console.error(err)
            return
          }
        })
      })
    })
  });
  I.wait(1)
})

