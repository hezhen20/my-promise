
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'
class Promise{
    constructor(executor) {
        this.status = PENDING       // promise 默认的状态
        this.value = undefined
        this.reason = undefined
        const resolve = (value) => {
            if (this.status === PENDING) {  // 只有等待状态的时候才执行
                this.value = value
                this.status = FULFILLED     // 修改状态
            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {  // 只有等待状态的时候才执行
                this.reason = reason
                this.status = REJECTED      // 修改状态
            }
        }
        try {                           //  executor 本身有可能执行会报错，所以 try catch 一下
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }
    then(onFulfilled, onRejected) {
        if (this.status === FULFILLED) {
            onFulfilled(this.value)         // 成功调用成功方法
        }
        if (this.status === REJECTED) {
            onRejected(this.reason)         // 失败调用失败方法
        }
    }
}

module.exports = Promise