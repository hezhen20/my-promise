let myPromise = require('./src/promise4')

let promise2 = new myPromise((resolve, reject) => {
  resolve('success')
}).then(data => {
  return promise2
})

promise2.then(data => {
  console.log('data', data);
}, err => {
  console.log('err', err);      // err TypeError: 错误
})

let promise3 = new myPromise((resolve, reject) => {
  resolve('success')
}).then(data => {
  return new myPromise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, 100);
  })
})

promise3.then(data => {
  console.log('data', data);      // data success
}, err => {
  console.log('err', err);
})

let promise4 = new myPromise((resolve) => {
  resolve('data')
}).then(data => {
  return new myPromise((resolve, reject) => {
    reject(data)
  })
})

promise4.then(data => {
  console.log('data', data);
}, err => {
  console.log('err', err);    // err data
})

let promise5 = new myPromise((resolve) => {
  resolve('data')
}).then(data => {
  return new myPromise((resolve, reject) => {
    resolve(new myPromise((resolve) => {
      resolve('success')
    }))
  })
})

promise5.then(data => {
  console.log('data', data);      // data success
}, err => {
  console.log('err', err);
})