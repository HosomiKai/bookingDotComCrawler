const { I } = inject();
require('dotenv').config();
const fs = require('fs')
// Add in your custom step files


Given('拜訪頁面', () => {
  I.amOnPage('/');
});

Then('看到 {string}', (w) => {
  I.see(w);
})

Then('不看到 {string}', (w) => {
  I.dontSee(w);
})

Then('輸入飯店 {string}', (w) => {
  I.click({ name: 'q-destination' });
  I.fillField('q-destination', w);
  I.wait(2)
  I.pressKey('ArrowDown');
  I.pressKey('Enter');
})

Then('看到 {string}', (w) => {
  I.see('搜尋');

  I.click('._3pFoIe.eLsxCc');
  I.click('._3pFoIe.eLsxCc');
  I.click('._3pFoIe.eLsxCc');
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
    urlParams.set('q-check-in', bookingDate.checkInDate);
    urlParams.set('q-check-out', bookingDate.checkOutDate);

    return window.location.pathname + '?' + urlParams.toString();
  }, bookingDate);

  I.amOnPage(uri);
})

Then('查價錢', (w) => {

  I.see('選擇客房')
  I.waitForVisible('.y1QuoW section ul', 3);

  let plains = I.executeScript(function (e) {
    var hotel_name = '';                  //  set your counter to 1

    console.log('hotel Name', hotel_name = document.querySelector("#main > div._3umLRC > div > div > section._34UURu > div._1quDY2 > div._2h6Jhd > h1").innerHTML)
    console.log('plans ', document.querySelector(".y1QuoW section ul").children.length)
    var plains = document.querySelector(".y1QuoW section ul").children.length

    var hotel = {};
    hotel.plains = []
    hotel.name = hotel_name
    var kkk = 0

    for (plain = 1; plain <= plains; plain++) {
      console.log('items...', document.querySelector(".y1QuoW section ul li:nth-child(" + plain + ") > div > div._7mutbU > ul").children.length)
      var items = document.querySelector(".y1QuoW section ul li:nth-child(" + plain + ") > div > div._7mutbU > ul").children.length

      console.log('plain_name ', plain_name = document.querySelector(".y1QuoW section ul li:nth-child(" + plain + ")  > div > div._39YdZA > div._1Ocz2Z > div._3__H6i > h3").textContent)


      var item_prices = []
      for (item = 1; item <= items; item++) {
        if (plain == 1 && item == 1) {
          continue
        }
        console.log('now_item', item)

        document.querySelector(".y1QuoW section ul li:nth-child(" + plain + ") > div > div._7mutbU > ul > li:nth-child(" + item + ") > div > div.O7FDOI > button > span > span:nth-child(2)").click()

        item_prices.push(kkk++)

      }

      hotel.plains.push({
        'name': plain_name,
        'item_prices': item_prices,
      })

    }

    hotel.plains.forEach((h, hIndex) => {
      h.item_prices.forEach((i, iIndex) => {
        const newValue = document.querySelectorAll('.modal-container section div ul')[i].innerText // get data
        hotel.plains[hIndex].item_prices[iIndex] = newValue
      })
    })
    console.log(hotel);

    return hotel
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

