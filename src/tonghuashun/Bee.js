const moment = require('moment')
const axios = require('axios')
const jsonfile = require('jsonfile')
const path = require('path')
const _ = require('lodash')

// process.on('uncaughtException', function (err) {
//   console.log(err)
// })
class Bee {
  constructor (code = '', proxy) {
    this.id = `bee:${code}`
    this.code = code
    this.proxy = proxy
    this.bag = []
  }

  getData (startDate, endDate = moment().format('YYYMMDD')) {
    return new Promise((resolve, reject) => {
      const getData_ = async (startDate, endDate, id = 0) => {
        console.log(`${this.id} timestamp:${Date.now()}, ${JSON.stringify(this.proxy)}`)
        axios.get(`https://t.10jqka.com.cn/lgt/feed/getFeedList/?code=${this.code}&marketId=33&id=${id}`, {
          proxy: this.proxy
        })
          .then((chunk) => {
            const res = _.get(chunk, 'data.result')
            if (res.length === 0) {
              console.log(`${this.id} get all comments, total:${this.bag.length}`)
              return resolve(this.bag)
            }
            this.bag = this.bag.concat(res)
            const lastone = res[res.length - 1]
            if (`${lastone.ctime}000` < moment(startDate).valueOf()) {
              // console.log('过滤前', this.bag.length)
              this.bag = this.bag.filter((item) => {
                return `${item.ctime}000` > moment(startDate).valueOf() && `${item.ctime}000` < moment(endDate).valueOf()
              })
              // console.log('过滤后', this.bag.length)
              const filename = path.resolve(__dirname, `./comments/${this.code}-${startDate}.json`)
              jsonfile.writeFile(filename, this.bag, (err) => {
                err && console.error(err)
              })
              console.log(`${this.id} get all comments, total:${this.bag.length}`)
              return resolve(this.bag)
            } else {
              getData_(startDate, endDate, lastone.id)
            }
          })
          .catch((err) => {
            console.error(`${this.id} 获取一次评论失败`)
            reject(err)
          })
      }
      getData_(startDate, endDate)
    })
  }

  saveData () {}
}


const ips = require('./vpn/vpn-pools.json')
const { host, port } = ips[Math.floor(Math.random() * ips.length)]
const proxy = {
  host,
  port
}
// const bee = new Bee('000001', proxy)
// bee.getData('20200420', '20200421').then((res) => {
//   console.log(res)
// })

module.exports = Bee
