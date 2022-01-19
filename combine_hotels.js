const fs = require('fs')
const path = require('path');

const directoryPath = path.join(__dirname, 'hotels');
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file); 

        var lineReader = require('readline').createInterface({
          input: require('fs').createReadStream('./hotels/'+ file)
        });

        lineReader.on('line', function (line) {

          fs.writeFile('all.csv', line + '   \n', { flag: 'a+' }, err => {
            if (err) {
              console.error(err)
              return
            }
          })
          console.log('Line from file:', line);
        });

    });
});
