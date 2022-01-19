const fs = require('fs')


var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('hotelbeds.text')
});

lineReader.on('line', function (line) {

  output = 'Feature: 拜訪頁面\n  測試用拜訪頁面\n Scenario: 測試測試\n Given 拜訪頁面\n Then 看到 "您想去哪裡"\n Then 輸入飯店 "'+ line +'"\n Then 看到 "搜尋"\n Then 查價錢\n'
  fs.writeFile('./features/basic'+ line +'.feature', output + '   \n', { flag: 'w' }, err => {
    if (err) {
      console.error(err)
      return
    }
  })
  console.log('Line from file:', line);

});
