const path = require('path')
const dbModel = require('./dbModel')
const { downloadImgs } = require('./imgDownloader')

const getAll = () => {
  return new Promise((resolve, reject) => {
    dbModel.getRows({
      db: 'bili',
      col: 'user',
      query: {
        // mid: {
        //   $lt: 650
        // }
      },
      options: {}
    }, (rows) => {
      resolve(rows)
    })
  })
}

getAll().then((rows) => {
  console.log('从数据库中读取到的用户数量', rows.length) // 349
  let male = 0
  let female = 0
  let baomi = 0
  rows.forEach((item) => {
    if (item.sex === '男') {
      male++
    } else if (item.sex === '女') {
      female++
    } else {
      baomi++
    }
  })
  console.log(`男：${male}`, `女：${female}`, `保密：${baomi}`)
})
