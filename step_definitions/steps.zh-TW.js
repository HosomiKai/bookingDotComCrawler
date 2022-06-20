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
  I.fillField('#destination_form_field', w);
  I.wait(2)
  I.pressKey('ArrowDown');
  I.pressKey('Enter');

  I.click('#submit_button');
  // I.click('搜尋');
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
  I.click('#app-layer-base > div > main > div > div > div.uitk-layout-flex-item.main-body.m-t-margin-two.l-t-margin-three.xl-t-margin-three > section > div > div.uitk-spacing.search-results-listing.uitk-spacing-padding-small-block-three.uitk-spacing-padding-medium-blockstart-one.uitk-spacing-padding-large-blockstart-three > div > div.uitk-layout-grid-item.uitk-layout-grid-item-columnspan.uitk-layout-grid-item-columnspan-3 > section.results > ol > li:nth-child(1)');
})

Then('查價錢', (w) => 
{
  I.switchToNextTab();
  I.closeOtherTabs();
  I.click('客房');

  I.waitForElement('div.uitk-layout-flex.uitk-layout-flex-justify-content-space-between.uitk-spacing.uitk-spacing-margin-blockend-three > h2', 3); //選擇客房 
  I.waitForElement('#Offers > div > div:nth-child(3) > div', 3); // all rooms

  let plains = I.executeScript(function (e) {
    var hotel_name = document.querySelector("div.uitk-spacing.uitk-spacing-padding-small-blockend-four.uitk-spacing-padding-large-blockstart-three > h1").innerHTML;
    var hotel = {};
    var items = document.querySelector("#Offers > div > div:nth-child(3) > div").children.length;
    console.log('hotel Name', hotel_name)
    console.log('plans ', items)
    
    hotel.plains = [];
    hotel.name = hotel_name;
    
    for (item = 1; item <= items; item++) {
      console.log('now_item', item);
      let itemSelector = '#Offers > div > div:nth-child(3) > div > div:nth-child('+item+')';
      let itemNameSelector = itemSelector + ' div.uitk-spacing.uitk-spacing-padding-small-blockend-half > h3';
      let planName = document.querySelector(itemNameSelector).textContent;
      let itemPrices = [];

      try {  
        let priceDetailButtonSelector = itemSelector + ' > div.uitk-spacing.uitk-spacing-padding-inline-three.uitk-spacing-padding-blockend-three.uitk-layout-flex-item-align-self-stretch.uitk-layout-flex-item > div > div > div:nth-child(1) > div > button';
        let untaxedPriceSelector = '#app-layer-price-presentation-'+item+'-0 > div.uitk-dialog.uitk-dialog-fullscreen.uitk-dialog-fullscreen-bg-default.uitk-dialog-height-auto > div > div.uitk-dialog-content > div > div:nth-child(1) > div:nth-child(1) > table > tbody > tr:nth-child(1)';
        let taxSelector = '#app-layer-price-presentation-'+item+'-0 > div.uitk-dialog.uitk-dialog-fullscreen.uitk-dialog-fullscreen-bg-default.uitk-dialog-height-auto > div > div.uitk-dialog-content > div > div:nth-child(1) > div:nth-child(1) > table > tbody > tr:nth-child(2)';
        let totalPriceSelector = '#app-layer-price-presentation-'+item+'-0 > div.uitk-dialog.uitk-dialog-fullscreen.uitk-dialog-fullscreen-bg-default.uitk-dialog-height-auto > div > div.uitk-dialog-content > div > div:nth-child(1) > div:nth-child(3) > table > tbody > tr:nth-child(1)';

        //show price detail
        document.querySelector(priceDetailButtonSelector).click();
        
        //未稅價
        let untaxedPrice = document.querySelector(untaxedPriceSelector);
        if (untaxedPrice == null){
          continue;
        }
        itemPrices.push(untaxedPrice.textContent);
        //其他費用與稅金
        itemPrices.push(document.querySelector(taxSelector).textContent.replace('Additional information此為 Hotels.com 付給供應商 (例如：飯店) 的應繳稅款；如需詳細資訊，請參閱我們的使用條款。我們收取為您提供行程預訂的服務費。', ''));
        //總價
        itemPrices.push(document.querySelector(totalPriceSelector).textContent);
      } catch (e) {
        
      }

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
          .replace('晚NT$', '晚,NT$')
          .replace('稅金和其他費用', ',稅金和其他費用,')
          .replace('稅金NT$', ',稅金,NT$')
          .replace('總價', ',總價,');
          ;
      });

      fs.writeFile('./hotels/hotel_' + hotel.name + '_.csv', output.replace(/(?:<br>)/g, ',') + '   \n', { flag: 'a+' }, err => {
        if (err) {
          console.error(err)
          return
        }
      })
    })
  });
})

