
let myPromise = require('./src/promise3')

let promise2 = new myPromise((resolve, reject) => {
  resolve('success')
}).then(data => {
  console.log(data);      // success
}, err => {
  return 'reason'
})

promise2.then(data => {
  console.log('data', data);    // data undefined
}, err => {
})

let promise3 = new myPromise((resolve, reject) => {
  reject('error')
}).then(data => {
}, err => {
  console.log(err);     // error
  return 'reason'
})

promise3.then(data => {
  console.log('data', data);    // data reason
}, err => {
})

let promise4 = new myPromise((resolve, reject) => {
  reject('error')
}).then(data => {
}, err => {
  console.log(err);     // error
  name.a = 'a'
})

promise4.then(data => {
}, err => {
  console.log(err);       // ReferenceError: name is not defined 
})