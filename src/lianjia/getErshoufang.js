const axios = require('axios')
const path = require('path')
const cheerio = require('cheerio')
const toJson = require('./toJson')

const city = 'fs'

const getPageInfo = async (pageIndex = 1) => {
  // https://hui.lianjia.com/ershoufang/pg1/
  const url = `https://${city}.lianjia.com/ershoufang/pg${pageIndex}/`
  const res = await axios.get(url)
  const $ = cheerio.load(res.data)
  const pageData = []
  $('.sellListContent li').each((i, el) => {
    // el是原生dom，需要转jq对象
    const title = $(el).find('.info .title a').text()
    const url = $(el).find('.info .title a').attr('href')
    const position = $(el).find('.flood').text()
    const houseInfo = $(el).find('.address .houseInfo').text()
    const followInfo = $(el).find('.followInfo').text()
    const totalPrice = $(el).find('.priceInfo .totalPrice').text()
    const unitPrice = $(el).find('.priceInfo .unitPrice').attr('data-price')
    pageData.push({
      url,
      title,
      position,
      houseInfo,
      followInfo,
      totalPrice,
      unitPrice: Number(unitPrice)
    })
  })
  console.log(`当前页：${pageIndex}，有${pageData.length}条数据`)
  return pageData
}

const main = async () => {
  const totalPage = 100
  let currentPage = 1
  let allData = []
  while (currentPage <= totalPage) {
    const pageData = await getPageInfo(currentPage)
    allData = allData.concat(pageData)
    currentPage++
  }
  toJson(path.resolve(__dirname, `./json/${city}-ershoufang.json`), allData)
}
main()
