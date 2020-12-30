const fs = require('fs')
const axios = require('axios')
const path = require('path')
const { v4: uuid } = require('uuid')
const asyncUtil = require('async')

// 下载单张图片
async function downloadImg (imgUrl) {
  try {
    const { data } = await axios.get(imgUrl, { responseType: 'stream' })
    const writer = fs.createWriteStream(path.resolve(__dirname, `img-pool/${uuid()}.jpg`))
    await data.pipe(writer)
    console.log('下载完成', imgUrl)
  } catch (err) {
    console.log('err=', err)
  }
}
// downloadImg('https://acg.fi/wp-content/uploads/2020/12/172970cfbf69d57614_1_post.jpg')

// 批量下载
function downloadList (list) {
  return new Promise((resolve, reject) => {
    asyncUtil.mapLimit(list, 5, async (itemUrl) => {
      await downloadImg(itemUrl)
    }, (err, results) => {
      if (err) reject(err)
      else resolve(results)
    })
  })
}

module.exports = {
  downloadImg,
  downloadList
}
