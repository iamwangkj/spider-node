const axios = require('axios')
const path = require('path')
const toJson = require('./toJson')

// https://sz.fang.lianjia.com/loupan/baoanqu//
// 浏览器中输入：https://sz.fang.lianjia.com/loupan/baoanqu/pg12/?_t=1，可以直接查看数据结构
const main = async () => {
  // 获取总页数
  const totalPage = 12

  // 获取所有的数据，提炼出有用的数据，并写入json文件中
  const ajaxList = []
  for (let index = 1; index <= totalPage; index++) {
    const url = `https://sz.fang.lianjia.com/loupan/baoanqu/pg${index}/?_t=1`
    ajaxList.push(axios.get(url))
  }

  axios.all(ajaxList).then((res) => {
    let allData = []
    res.forEach(item => {
      // const p = item.data.data.list.map((ele) => {
      //   console.log('ele', ele)
      //   const { title, open_date2018, average_price, resblock_frame_area, district, bizcircle_name, address, developer_company } = ele
      //   return {
      //     title, open_date2018, average_price, resblock_frame_area, district, bizcircle_name, address, developer_company
      //   }
      // })
      allData = allData.concat(item.data.data.list)
    })
    console.log('allData', allData)// to json
    const filename = path.resolve(__dirname, './json/宝安区.json')
    toJson(filename, allData)
  })
}

main()
