
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

// 核心流程: 处理上一个 promise 的 then 中方法的返回值x，是普通值还是promise
function resolvePromise(promise2, x, resolve, reject) {
    // 情况1：x 就是 promise2 本身
    if (x === promise2) {
        reject(new TypeError('错误'))
    }

    // 情况2：x 可能是别人实现的 promise，得兼容一下
    if ((typeof x === 'object' && typeof x !== null) || typeof x === 'function') {  // x 是对象或者函数
        // 确保别人的promise只执行一次
        let called = false
        try {
            let then = x.then   // x.then 取值时可能会异常，用 try catch 包裹
            if (typeof then === 'function') {
                // 这里就认为这个 x 是promise了
                then.call(x, y => {
                    if (called) return
                    called = true
                    resolvePromise(promise2, y, resolve, reject)       // y可能还是个promise，递归
                }, r => {
                    if (called) return
                    called = true
                    reject(r)
                })
            }
        } catch (error) {
            if (called) return
            called = true
            reject(error)
        }
    } else {
        // x是普通值，直接 resolve
        resolve(x)
    }
}
class Promise{
    constructor(executor) {
        this.status = PENDING       // promise 默认的状态
        this.value = undefined
        this.reason = undefined

        this.onResolvedCallbacks = []   // 存放成功的回调方法
        this.onRejectedCallbacks = []   // 存放失败的回调方法

        const resolve = (value) => {
            if (this.status === PENDING) {  // 只有等待状态的时候才执行
                this.value = value
                this.status = FULFILLED     // 修改状态
                
                // 发布
                this.onResolvedCallbacks.forEach(fn => fn())

            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {  // 只有等待状态的时候才执行
                this.reason = reason
                this.status = REJECTED      // 修改状态

                // 发布
                this.onRejectedCallbacks.forEach(fn => fn())

            }
        }
        try {                           //  executor 本身有可能执行会报错，所以 try catch 一下
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }
    then(onFulfilled, onRejected) {

        // 返回新的promise, 实现链式调用
        let promise2 = new Promise((resolve, reject) => {
            // 先订阅，存到数组中，resolve/reject 的时候再发布，去执行数组中的方法
            if(this.status === PENDING) {
                // this.onResolvedCallbacks.push(onFulfilled)
                this.onResolvedCallbacks.push(() => {   // 注意这么写和上面注释的写法的区别，这里相当于扩展了，除了执行onFulfilled外，我还可以做其他操作
                    // do something

                    // 用 setTimeout 包一下，这样 resolvePromise 方法才能拿到 promise2，否则 promise2都还没初始化完
                    setTimeout(() => {
                        try {
                            // 把上一个promise的then中成功的执行结果传到下一个then的成功处理函数中(递归的感觉)
                            let x = onFulfilled(this.value)
    
                            // 这个返回值x有可能是promise，这个返回的promise的执行结果就决定了promise2是走成功处理函数还是失败处理函数
                            // 这有个问题，代码执行到这的时候，promise2还没初始化完，是不能传给函数resolvePromise使用的,所以外面包一层 setTimeout
                            resolvePromise(promise2, x, resolve, reject)
    
                        } catch (error) {
                            // 如果上一个promise的then中成功函数执行出错,那么就要把错误传到下一个then的失败处理函数中
                            reject(error)
                        }
                    }, 0);
                    
                })
                this.onRejectedCallbacks.push(() => {
                    // do something

                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0);
                })
            }

            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)         // 成功调用成功方法
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)         // 失败调用失败方法
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            }
        })
        return promise2
    }
}

module.exports = Promise