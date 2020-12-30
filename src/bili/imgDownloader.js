const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { randomGet } = require('./randomGet')
const agentList = require('./user-agent')

// 根据绝对路径的图片url，获取图片名称
const getImgName = (imgUrl) => { // '16d431e4-3237-4b7d-a53d-ec1e0dfba424.jpg'
  const arrSlipt = imgUrl.split('/')
  // [
  //   'https:',
  //   '',
  //   'image1.ljcdn.com',
  //   'hdic-resblock',
  //   '16d431e4-3237-4b7d-a53d-ec1e0dfba424.jpg'
  // ]
  const len = arrSlipt.length
  return {
    filename: arrSlipt[len - 1],
    dirName: arrSlipt[len - 2]
  }
}

// 下载单张图片
const downloadImg = async (imgUrl, imgDir = __dirname) => {
  const res = await axios.get(imgUrl, {
    responseType: 'stream'
  })
  const { filename, dirName } = getImgName(imgUrl)
  // 检测目录是否存在
  const dirPath = path.resolve(imgDir, dirName)
  const dirExists = fs.existsSync(dirPath)
  if (!dirExists) { // 该路径是否存在
    fs.mkdirSync(dirPath, { recursive: true })
  }
  const writeStream = fs.createWriteStream(`${dirPath}/${filename}`)
  res.data.pipe(writeStream)
  console.log('下载完成', imgUrl)
}

// 下载批量图片
const downloadImgs = async (imgList, imgDir = __dirname) => {
  const instance = axios.create({
    // baseURL: 'https://api.bilibili.com/x/space/',
    headers: {
      'User-Agent': randomGet(agentList)
    }
    // proxy: {
    //   host,
    //   port
    // }
  })

  imgList.forEach((item) => {
    downloadImg(item, imgDir)
  })
}

module.exports = {
  downloadImg,
  downloadImgs
}
