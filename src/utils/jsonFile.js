const jsonfile = require('jsonfile')

function saveJson (data, filename) {
  jsonfile.writeFile(filename, data, (err) => {
    err && console.error(err)
  })
  console.log(`生成json文件：${filename}`)
}

module.exports = {
  saveJson
}
