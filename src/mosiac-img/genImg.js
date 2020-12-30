const imgGenerator = require('mosaic-node-generator')
const path = require('path')

// function mosaic(
//   inputImagePath: string,
//   tilesDirectory?: string,
//   cellWidth?: number,
//   cellHeight?: number,
//   columns?: number,
//   rows?: number,
//   thumbsDirectoryFromRead?: string,
//   thumbsDirectoryToWrite?: string,
//   enableConsoleLogging?: boolean
// ): void;

// 生成马赛克图
function genImg () {
  imgGenerator.mosaic(
    path.resolve(__dirname, 'img-input/pk.jpg'), // 源图
    path.resolve(__dirname, 'img-pool'), // 瓦片图
    30,
    30,
    50,
    50,
    null, // 'thumbnails_30',
    'thumbnails_30',
    true
  )
}

module.exports = genImg
