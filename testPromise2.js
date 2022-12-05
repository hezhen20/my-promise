let myPromise = require('./src/promise2')

let promise = new myPromise((resolve, reject) => {
    console.log('promise execute');
    setTimeout(() => {
        resolve('成功')
    }, 1000);
})
promise.then((value) => {
    console.log('success', value);
}, (reason) => {
    console.log('err', reason);
})
console.log('ok');