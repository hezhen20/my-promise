
// 实现 Promise 的链式调用,考虑返回值为普通值的情况

const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'
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

                    try {
                        // 把上一个promise的then中成功的执行结果传到下一个then的成功处理函数中(递归的感觉)
                        let x = onFulfilled(this.value)
                        resolve(x)
                    } catch (error) {
                        // 如果上一个promise的then中成功函数执行出错,那么就要把错误传到下一个then的失败处理函数中
                        reject(error)
                    }
                    
                })
                this.onRejectedCallbacks.push(() => {
                    
                    try {
                        let x = onRejected(this.reason)
                        resolve(x)
                    } catch (error) {
                        reject(error)
                    }

                })
            }
            if (this.status === FULFILLED) {

                try {
                    let x = onFulfilled(this.value)
                    resolve(x)
                } catch (error) {
                    reject(error)
                }

            }
            if (this.status === REJECTED) {
                try {
                    let x = onRejected(this.reason)         // 失败调用失败方法
                    resolve(x)
                } catch (error) {
                    reject(error)
                }
            }
        })
        return promise2
    }
}

module.exports = Promise