
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'
class Promise{
    constructor(executor) {
        this.status = PENDING
        this.value = undefined
        this.reason = undefined

        this.onResolvedCallbacks = []   // 存放成功的回调方法
        this.onRejectedCallbacks = []   // 存放失败的回调方法

        const resolve = (value) => {
            if (this.status === PENDING) {
                this.value = value
                this.status = FULFILLED
                
                // 发布
                this.onResolvedCallbacks.forEach(fn => fn())

            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.reason = reason
                this.status = REJECTED

                // 发布
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
            onFulfilled(this.value)
        }
        if (this.status === REJECTED) {
            onRejected(this.reason)
        }
    }
}

module.exports = Promise