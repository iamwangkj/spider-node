const path = require('path')
const xlsx = require('node-xlsx')
const fs = require('fs')
const data = require('./json/fs-ershoufang.json')

const jsonToExcel = (json = [], filename, sheetName = 'newSheet') => {
  const data = []
  // 生成表头
  const rowTitle = []
  for (const key in json[0]) {
    rowTitle.push(key)
  }
  data.push(rowTitle)
  // 插入每行数据
  json.forEach((object) => {
    const row = []
    for (const key in object) {
      const val = object[key]
      row.push(val)
    }
    data.push(row)
  })
  // 将流写入文件
  const buffer = xlsx.build([{ name: sheetName, data: data }]) // Returns a buffer
  fs.writeFile(filename, buffer, function () {
    console.log('导出成功', filename)
  })
}

jsonToExcel(data, path.resolve(__dirname, 'ershoufang.xlsx'))
