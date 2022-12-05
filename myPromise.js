
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'
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

        // 先订阅，存到数组中，resolve/reject 的时候再发布，去执行数组中的方法
        if(this.status === PENDING) {
            // this.onResolvedCallbacks.push(onFulfilled)
            this.onResolvedCallbacks.push(() => {   // 注意这么写和上面注释的写法的区别，这里相当于扩展了，除了执行onFulfilled外，我还可以做其他操作
                // do something
                onFulfilled(this.value)
            })
            this.onRejectedCallbacks.push(() => {
                // do something
                onRejected(this.reason)
            })
        }

        if (this.status === FULFILLED) {
            onFulfilled(this.value)         // 成功调用成功方法
        }
        if (this.status === REJECTED) {
            onRejected(this.reason)         // 失败调用失败方法
        }
    }
}

module.exports = Promise