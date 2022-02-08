const fs = require('fs');

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('hotelbeds.text')
});

lineReader.on('line', function (line) {
  output = 'Feature: Hotel搜尋價格\n'
          +'  拜訪旅館頁面\n'
          +` Scenario: 搜尋 ${line}\n`
          +' Given 拜訪頁面\n'
          +' Then 看到 "您想去哪裡"\n'
          +` Then 輸入飯店 "${line}"\n`
          +' Then 看到 "搜尋"\n';

  let dateString = '2022 3 3';
  let checkInDate = new Date(dateString);
  let now = new Date();
  
  if (now < checkInDate ) {
    output += ` Then 選擇入住時間 ${dateString}\n`;
  }

  output +=' Then 查價錢\n';

  let filepath = `./features/basic${line}.feature`;

  fs.writeFile(filepath, output, { flag: 'w' }, 
    err => {
      if (err) {
        console.error(err)
        return
      }
    });

  console.log('Line from file:', line);
});
