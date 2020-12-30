const axios = require('axios')
const cheerio = require('cheerio')

const getPolicy = async () => {
  const resList = [] // 存放结果的数组
  const url = 'http://www.gov.cn/zhengce/index.htm'
  const res = await axios.get(url)
  const $ = cheerio.load(res.data)
  $('.latestPolicy_left_item a').each((index, el) => {
    const title = $(el).text()
    const url = $(el).attr('href')
    const item = {
      title,
      url
    }
    resList.push(item)
  })
  console.log(resList)
}

getPolicy()
