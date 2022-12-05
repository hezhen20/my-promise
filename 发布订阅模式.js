const fs = require('fs')

// 发布订阅模式，核心就是把多个方法先暂存起来，最后依次执行
let events = {
    _events: [],     // 事件数组
    on(fn) {        // on 可以理解为订阅的操作
        this._events.push(fn)
    },
    emit(data) {
        this._events.forEach(fn => fn(data))
    },
}

// on订阅是有顺序的，顺序就靠数组来控制
events.on((data) => {
    console.log('每读取一次, 就触发一次', data);
})
let arr = []
events.on((data) => {
    arr.push(data)
})
events.on((data) => {
    if (arr.length === 2) {     // 最终结果还是要靠计数器
        console.log('读取完毕, 结果为', arr);
    }
})

fs.readFile('./a.txt', 'utf8', function(err, data) {
    events.emit(data)
})
fs.readFile('./b.txt', 'utf8', function(err, data) {
    events.emit(data)
})