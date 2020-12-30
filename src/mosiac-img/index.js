const axios = require('axios')
const downloadImg = require('./downloadImg')
const genImg = require('./genImg')

// 从数据库读取大量图片url
async function getImgList () {
  try {
    const res = await axios.get('http://127.0.0.1:8360/meizitu/getAll')
    const realRes = res.data.data
    console.log('图片的数量=', realRes.length)
    const imgList = realRes.map((item) => {
      return item.imgUrl
    })
    return imgList
  } catch (err) {
    console.log('err=', err)
  }
}

// 程序入口
async function main () {
  const list = await getImgList()
  const imgUrlList = list.map((item) => {
    return item.imgUrl
  })
  await downloadImg.downloadList(imgUrlList)
  genImg()
}
main()
