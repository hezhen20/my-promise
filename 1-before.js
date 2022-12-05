function core(...args) {
  console.log('core code...', args);
}

Function.prototype.before = function(callback) {
  return (...args) => {
    callback()    // 先执行传入的回调函数
    this(...args)        // 这里的this是core（箭头函数的this指向外层的作用域，谁调用的before，this就指向谁）
  }
}

let newFn = core.before(() => {
  console.log('my before code...');
})

newFn('1','2')    // my before code...   core code...  ['1','2']