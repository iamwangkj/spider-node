const log4js = require('log4js')
// logger 是log4js的实例，唯一可以传的一个参数category
log4js.configure({
  appenders: {
    kjlog: {
      type: 'file',
      filename: 'log/1.log'
    }
  },
  categories: {
    default: {
      appenders: ['kjlog'],
      level: 'info'
    }
  }
})
const logger = log4js.getLogger()

// logger.trace('this is trace')
// logger.debug('this is debug')
// logger.info('this is info')
// logger.warn('this is warn')
// logger.error('this is error')
// logger.fatal('this is fatal')

function logInfo (str = '我是fn log') {
  return logger.info(str)
}

function logError (str) {
  logger.error(str)
}

module.exports = {
  logInfo,
  logError
}
