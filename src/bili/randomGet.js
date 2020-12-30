
const randomGet = (arr) => {
  const len = arr.length
  const randomIndex = Math.floor(Math.random() * len)
  return arr[randomIndex]
}

module.exports = {
  randomGet
}
