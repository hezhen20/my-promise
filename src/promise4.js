
// 实现 Promise 的链式调用，处理返回值 x

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
        this.status = PENDING
        this.value = undefined
        this.reason = undefined
        this.onResolvedCallbacks = []
        this.onRejectedCallbacks = []
        const resolve = (value) => {
            if (this.status === PENDING) {
                this.value = value
                this.status = FULFILLED
                this.onResolvedCallbacks.forEach(fn => fn())
            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.reason = reason
                this.status = REJECTED
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }
    then(onFulfilled, onRejected) {
        
        // 返回新的 promise,实现链式调用
        let promise2 = new Promise((resolve, reject) => {
            if(this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {

                    // 用 setTimeout 包一下，这样 resolvePromise 方法才能拿到 promise2，否则 promise2都还没初始化完
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value)

                            // 这个返回值x有可能是promise，这个返回的promise的执行结果就决定了promise2是走成功处理函数还是失败处理函数
                            // 这有个问题，代码执行到这的时候，promise2还没初始化完，是不能传给函数resolvePromise使用的,所以外面包一层 setTimeout
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0);
                    
                })
                this.onRejectedCallbacks.push(() => {
                    
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
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0);

            }
            if (this.status === REJECTED) {

                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
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