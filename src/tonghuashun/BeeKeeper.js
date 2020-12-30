const sentiment = require('sentiment-zh_cn')

class BeeKeeper {
  constructor () {
    this.id = `BeeKeeper_${new Date().getTime()}`
  }

  saveToDB () {}
}

module.exports = BeeKeeper
