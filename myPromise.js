
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

        // 返回新的promise, 实现链式调用
        let promise2 = new Promise((resolve, reject) => {
            // 先订阅，存到数组中，resolve/reject 的时候再发布，去执行数组中的方法
            if(this.status === PENDING) {
                // this.onResolvedCallbacks.push(onFulfilled)
                this.onResolvedCallbacks.push(() => {   // 注意这么写和上面注释的写法的区别，这里相当于扩展了，除了执行onFulfilled外，我还可以做其他操作
                    // do something

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
                    // do something

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
                    let x = onFulfilled(this.value)         // 成功调用成功方法
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