// function isType(val, type) {
//   return Object.prototype.toString.call(val) === `[object ${type}]`
// }

// console.log(isType(123, 'String'));   // false
// console.log(isType(123, 'Number'));   // true

// function isString(type) {
//   return function(val) {
//     return Object.prototype.toString.call(val) === `[object ${type}]`
//   }
// }

// let myIsString = isString('String')
// console.log(myIsString(123));       // false
// console.log(myIsString('123'));     // true

// 通用柯里化
function curring(fn) {
  const inner = (args = []) => {
    return args.length >= fn.length ? fn(...args) : (...userArgs) => inner([...args, ...userArgs]) 
  }
  return inner()
}
// function sum(a,b,c,d) {
//   return a + b + c + d
// }
// test
// let sum1 = curring(sum)
// let sum2 = sum1(1)
// let sum3 = sum2(2,3)
// let result = sum3(4)
// console.log(result);    // 10

// function isType(type, val) {
//   return Object.prototype.toString.call(val) === `[object ${type}]`
// }
// let util = {};
// ['String', 'Number', 'Boolean', 'Null', 'Undefined'].forEach(type => {
//   util[`is${type}`] = curring(isType)(type)
// });

// // test
// console.log(util.isNumber('123'))  // false
// console.log(util.isNull(null))  // true
