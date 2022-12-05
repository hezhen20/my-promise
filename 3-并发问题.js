// 柯里化思想处理并发问题

const fs = require('fs')

function after(times, callback) {
  let resultArr = []
  return (data) => {
    resultArr.push(data)
    if (--times === 0) {
      callback(resultArr)
    }
  }
}

let handle = after(2, (resultArr) => {      // handle两次后执行回调函数
  console.log('数据都拿到了', resultArr);
})

fs.readFile('./a.txt', 'utf8', function(err, data) {
  handle(data)
})
fs.readFile('./b.txt', 'utf8', function(err, data) {
  handle(data)
})