const axios = require('axios')
const agentList = require('./user-agent')
const dbModel = require('./dbModel')
const { randomGet } = require('./randomGet')
const toJson = require('./toJson')
const path = require('path')

// 通过id获取一个用户信息
const getUserInfo = (id) => {
  const userInfoUrl = `https://api.bilibili.com/x/space/acc/info?mid=${id}&jsonp=jsonp`
  const funsUrl = `hhttps://api.bilibili.com/x/relation/stat?vmid==${id}&jsonp=jsonp`
  const likeUrl = `https://api.bilibili.com/x/space/upstat?mid=${id}&jsonp=jsonp`
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
  return axios.all([instance.get(userInfoUrl), instance.get(funsUrl), instance.get(likeUrl)])
}

// 主入口
const main = () => {
  const startId = 0
  const endId = 200
  let i = startId
  const errIds = []
  let partUser = []

  const timer = setInterval(() => {
    const id = i
    getUserInfo(id)
      .then((res) => {
        const uesrInfo = Object.assign(res[0].data.data, res[1].data.data, res[2].data.data)
        partUser.push(uesrInfo)
        console.log('收集到用户', id, '的数据')
        if (partUser.length === 10) {
          dbModel.insertMany('bili', 'user', partUser)
          partUser = []
        }
      })
      .catch((err) => {
        console.error('获取失败', id, err)
        errIds.push(id)
      })
    if (++i > endId) {
      clearInterval(timer)
      console.log('全部请求发送完毕')
    }
  }, 3000)
}

main()
