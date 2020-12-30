const moment = require('moment')
const axios = require('axios')
const jsonfile = require('jsonfile')
const path = require('path')

// const { connect, Schema, model } = require('mongoose')
// const stockModel = require('../models/stock')

class Tushare {
  constructor () {
    this.id = `Tushare_${new Date().getTime()}`
    this.domain = 'http://api.tushare.pro'
    this.token = '636de5eeb64f0c7f44165b5e9f4458fbdb18faab6f7bd8aa565535c1'
  }

  _formatItem (item) {
    // 0ts_code 1trade_date 2open 3high 4low 5close 6pre_close 7change 8pct_chg 9vol 10amount
    const itemTmp = {
      ts_code: item[0],
      trade_date: item[1],
      open: item[2],
      high: item[3],
      low: item[4],
      close: item[5],
      pre_close: item[6],
      change: item[7],
      pct_chg: item[8],
      vol: item[9], // 成交量
      amount: item[10] // 成交额
    }
    return itemTmp
  }

  async getAllStock (date = moment().format('YYYYMMDD')) {
    const postData = {
      api_name: 'daily',
      token: this.token,
      params: {
        trade_date: date
      },
      fields: ''
    }
    const res = await axios.post(this.domain, postData)
    const { items: stockList } = res.data.data
    const formatList = stockList.map((item) => {
      return this._formatItem(item)
    })
    // write to json
    const filename = path.resolve(__dirname, `./stock/${date}.json`)
    jsonfile.writeFile(filename, formatList, (err) => {
      err && console.error(err)
    })

    console.log(`date:${date}, tushare get all stock, total:${formatList.length}`)
    return formatList
  }
}

// const tushareIns = new Tushare()
// tushareIns.getAllStock('20200421')

module.exports = Tushare
