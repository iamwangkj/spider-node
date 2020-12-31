const axios = require('axios')
const dayjs = require('dayjs')
const { saveJson } = require('../utils/jsonFile')

async function getHotZonghe (pageIndex = 1) {
  const url = `https://api.bilibili.com/x/web-interface/popular?ps=20&pn=${pageIndex}`
  const { data } = await axios.get(url)
  // console.log('data', data)
  if (data.data.no_more) return []
  const list = data.data.list.map((item) => {
    const { bvid, owner, pubdate, stat, title } = item
    return {
      videoId: bvid,
      videoUrl: `https://www.bilibili.com/video/${bvid}`,
      name: title,
      publishDate: dayjs(pubdate * 1000).format('YYYY-MM-DD HH:mm:ss'),
      view: stat.view,
      danmu: stat.danmaku,
      dianzan: stat.like,
      coin: stat.coin,
      shoucang: stat.favorite,
      share: stat.share,
      reply: stat.reply,
      owner
    }
  })
  return list
}

async function main () {
  let pageIndex = 1
  let isEnd = false
  let resList = []
  while (!isEnd) {
    const list = await getHotZonghe(pageIndex)
    // console.log('当前页码=', pageIndex, list)
    if (list.length > 0) {
      resList = resList.concat(list)
      ++pageIndex
    } else {
      isEnd = true
    }
  }
  console.log('总共=', resList.length)

  await saveJson(resList, 'data-json/bili-hot.json')
}
// main()

function sortByView () {
  let list = require('../../data-json/bili-hot.json')
  list = list.sort((a, b) => {
    const b1 = b.danmu + b.reply
    const a1 = a.danmu + a.reply
    return b1 - a1
  })
  saveJson(list, 'data-json/bili-hot-sort-互动最多.json')
}
sortByView()
