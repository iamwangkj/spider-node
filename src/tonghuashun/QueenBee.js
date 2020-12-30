const sentiment = require('sentiment-zh_cn')

class QueenBee {
  constructor (code = '') {
    this.id = `QueenBee${new Date().getTime()}`
    this.report = {}
  }

  analyze (list) {
    let zhongxingCount = 0
    let goodCount = 0
    let badCount = 0
    list.forEach((item) => {
      const { content } = item
      const res = sentiment(content, {
        暴跌: -10,
        跌: -5,
        涨: 5,
        暴涨: 10
      })
      const { score } = res
      if (score < 0) {
        badCount++
      } else if (score === 0) {
        zhongxingCount++
      } else {
        goodCount++
      }
    })

    return {
      code: list.length > 0 ? list[0].code : '',
      totle: list.length,
      good: goodCount,
      bad: badCount,
      neutral: zhongxingCount,
      conclusion: (goodCount - badCount) / badCount * 100 + '%'
    }
  }

  saveToDB () {}
}

const QueenBee_ = new QueenBee()

module.exports = QueenBee_
