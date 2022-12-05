let myPromise = require('./src/promise1')


let promise = new myPromise((resolve, reject) => {
    console.log('promise execute');
    resolve('成功')
    reject('失败')
})
promise.then((value) => {
    console.log('success', value);
}, (reason) => {
    console.log('err', reason);
})
console.log('ok');