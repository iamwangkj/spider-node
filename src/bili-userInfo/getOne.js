const axios = require('axios')
const { delayRequest } = require('../utils/vsSpiderAgainst')
const { saveJson } = require('../utils/jsonFile')
const { logInfo } = require('../utils/log')

const axiosIns = axios.create({
  headers: {
    cookie: '_uuid=745532C1-B7FD-470E-48B3-2A9D6C4100B167302infoc; bfe_id=6f285c892d9d3c1f8f020adad8bed553; buvid3=93842A1F-621B-4E17-B642-D236329DD9A7143080infoc; sid=d8xqk487; fingerprint=c44965a0915d92b2fa30f9a5a6bec259; buvid_fp=BA9E607A-7AB4-3772-D054-CB8EFE9B7A2946581infoc; buvid_fp_plain=BA9E607A-7AB4-3772-D054-CB8EFE9B7A2946581infoc; DedeUserID=7072470; DedeUserID__ckMd5=0a72d3d52f396260; SESSDATA=0e6dc5b5%2C1624870777%2Cc2912*c1; bili_jct=f5e254ad8bae6d729c67e11d89eeed69'
  }
})

// 通过id获取一个用户信息
async function getUserInfo (id) {
  try {
    const info = await axios.get(`https://api.bilibili.com/x/space/acc/info?mid=${id}`)
    const stat = await axios.get(`https://api.bilibili.com/x/relation/stat?vmid=${id}`)
    const upstat = await axiosIns.get(`https://api.bilibili.com/x/space/upstat?mid=${id}`)
    const { name, sex, face, level } = info.data.data
    const { following, follower } = stat.data.data
    const { archive, likes } = upstat.data.data
    const userInfo = {
      id,
      name,
      sex,
      faceImg: face,
      level,
      following,
      follower,
      huozan_num: likes,
      bofang_num: archive.view
    }
    console.log(`id=${id}，获取信息成功`)
    return userInfo
  } catch (err) {
    console.error(err)
    logInfo(`id=${id} get fail`)
  }
}
// getUserInfo(7072472)

// 批量
async function getList (startId, endId) {
  const startTime = Date.now()
  const all = []
  let id = startId
  const timer = setInterval(async () => {
    if (id > endId) {
      clearInterval(timer)
      const endTime = Date.now()
      const useTime = (endTime - startTime) / 1000
      console.log(`全部完成，用时${useTime}秒`)
      saveJson(all, '1.json')
    } else {
      // 一次获取20个用户信息，3秒一次
      const resChunk = await Promise.all([
        getUserInfo(id),
        getUserInfo(++id),
        getUserInfo(++id),
        getUserInfo(++id),
        getUserInfo(++id),
        getUserInfo(++id),
        getUserInfo(++id),
        getUserInfo(++id),
        getUserInfo(++id),
        getUserInfo(++id),
        getUserInfo(++id),
        getUserInfo(++id),
        getUserInfo(++id),
        getUserInfo(++id),
        getUserInfo(++id),
        getUserInfo(++id),
        getUserInfo(++id),
        getUserInfo(++id),
        getUserInfo(++id),
        getUserInfo(++id)
      ])
      console.log('一次获取到的数量=', resChunk.length)
      // all.push(res)
      ++id
    }
  }, 3000)
}

// 程序入口
async function main () {
  getList(800, 1400)
}
main()
