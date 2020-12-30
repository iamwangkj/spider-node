const moment = require('moment')
const Bee = require('./Bee')
const QueenBee = require('./QueenBee')
const Tushare = require('./Tushare')
const jsonfile = require('jsonfile')
const path = require('path')

const stockJsonData = require('./stock/20200420.json')
// const stockJsonData = ''
const vpnPool = require('./vpn/vpn-pools.json')

const report = () => {
  console.log('所有的stockJsonData,length', stockJsonData.length)

  // 数据太多，过滤一下，过滤出6开头的

  const stockNeedGetComments = stockJsonData.slice(0, 10)
  // const stockNeedGetComments = stockJsonData.filter((item) => item.ts_code[0] === '6')
  console.log(`先选 ${stockNeedGetComments.length} 个来查评论，太多会被封:`)
  // 所有蜜蜂出去采蜜
  const promiseList = []
  stockNeedGetComments.forEach((item) => {
    const code = item.ts_code.split('.')[0]
    const randomIndex = Math.floor(Math.random() * vpnPool.length)
    const { host, port } = vpnPool[randomIndex]
    const proxy = {
      host,
      port
    }
    const bee = new Bee(code)
    promiseList.push(bee.getData('20200420', '20200421'))
  })
  Promise.allSettled(promiseList)
    .then((list) => {
      const reportList = []
      list.forEach((res) => {
        if (res.status === 'fulfilled') {
          console.log('有一只蜜蜂完成采蜜', res)
          res.value.length > 0 && reportList.push(QueenBee.analyze(res.value))
        } else if (res.status === 'rejected') {
          console.log('获取失败')
        }
      })
      // to json
      const filename = path.resolve(__dirname, `./report/${Date.now()}.json`)
      jsonfile.writeFile(filename, reportList, console.error)
    })
}
report()
