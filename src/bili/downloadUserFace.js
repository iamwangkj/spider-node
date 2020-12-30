const path = require('path')
const dbModel = require('./dbModel')
const { downloadImgs } = require('./imgDownloader')

const main = async () => {
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
    console.log(rows)
    const imgs = rows.map((item) => {
      return item.face
    })
    console.log('头像张数', imgs.length)
    downloadImgs(imgs, path.resolve(__dirname, 'downloads'))
  })
  return false
}

main()
