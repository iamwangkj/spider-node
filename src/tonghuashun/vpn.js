const axios = require('axios')
const cheerio = require('cheerio')
const htmlparser2 = require('htmlparser2')
const jsonfile = require('jsonfile')
const path = require('path')
const ip = require('ip')

const getIp = (pageIndex = '') => {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://www.xicidaili.com/nt/${pageIndex === 0 ? '' : pageIndex}`)
      .then(({ data }) => {
        const $ = cheerio.load(data)
        const ipList = []
        $('tr').each((i, elem) => {
          const type = $(elem).find('td').eq(5).text()
          const host = $(elem).find('td').eq(1).text()
          const port = $(elem).find('td').eq(2).text()
          ipList[i] = {
            host,
            port,
            type
          }
        })
        // 移除第一个空值
        ipList.shift()
        resolve(ipList)
      })
  })
}

const getIps1 = () => {
  return new Promise((resolve, reject) => {
    axios
      .get('https://proxygather.com/zh/proxylist/anonymity/?t=Transparent', {
        // proxy: {
        //   host: ip.address(),
        //   port: 443
        // },
        // headers: {
        //   'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        //   cookie: '__cfduid=d7ad17c1e533153d9076d72132f92bb5c1587437141; _lang=zh-CN; ASP.NET_SessionId=qgo0ba45sz3vggrkf152zymt'
        // }
      })
      .then(({ data }) => {
        const $ = cheerio.load(data)
        const ipList = []
        $('#tblproxy script').each((i, elem) => {
          const str = $(elem).html().toString()
          const len = str.length
          const objStr = str.substring(34, len - 19)
          const { PROXY_IP, PROXY_PORT } = JSON.parse(objStr)
          ipList[i] = {
            host: PROXY_IP,
            port: parseInt('0x' + PROXY_PORT, 16)
          }
        })
        resolve(ipList)
      })
      .catch(reject)
  })
}

// getIps1().then((res) => {
//   console.log(res)
//   const file = path.resolve(__dirname, './vpn/vpn-pools.json')
//   jsonfile.writeFile(file, res, console.error)
// }).catch((err) => {
//   console.log(err)
// })

const checkIp = (ip) => {
  const { host, port } = ip
  return axios.get('https://t.10jqka.com.cn/lgt/feed/getFeedList/?code=000001&marketId=33&id=', {
    proxy: {
      host,
      port
    },
    timeout: 5000
  })
}

// checkIp({
//   host: '113.53.91.214',
//   port: 8080
// }).then((res) => {
//   console.log(res)
// })

const checkIpList = (list) => {
  const validIpList = list.map((item) => {
    // console.log(`${item.ip}:${item.port}`)
    // https://t.10jqka.com.cn
    // http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
    // https://t.10jqka.com.cn/lgt/feed/getFeedList/?code=000001&marketId=33&id=
    return axios.get('https://t.10jqka.com.cn/lgt/feed/getFeedList/?code=000001&marketId=33&id=', {
      proxy: {
        host: item.host,
        port: item.port
      },
      timeout: 5000
    })
  })
  return Promise.allSettled(validIpList)
}

const getValidIpList = async (list_) => {
  console.log('准备检查的ip', list_)
  const listValid = []
  checkIpList(list_)
    .then((ress) => {
      ress.forEach((res) => {
        console.log('每个检查ip的结果', res)
        if (res.status === 'rejected') {
          // console.log('不好的ip', res)
        } else if (res.status === 'fulfilled') {
          // console.log('好的ip', res)
          // listValid.push()
        }
      })
    })
}

module.exports = getValidIpList

const run = async () => {
  const ips = await getIps1()
  const data = await getValidIpList(ips)
  // to json
  const file = path.resolve(__dirname, './vpn/vpn-pools.json')
  jsonfile.writeFile(file, data, console.error)
}
run()
