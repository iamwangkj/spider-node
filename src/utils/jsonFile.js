const jsonfile = require('jsonfile')

function saveJson (data, filename) {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(filename, data, (err) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        console.log('写入json成功', filename)
        resolve(filename)
      }
    })
  })
}

module.exports = {
  saveJson
}
