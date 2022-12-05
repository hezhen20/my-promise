class Subject{                 // 被观察者的类
    constructor(name) {
        this.name = name
        this.state = '睡觉ing'
        this.observers = []     // 观察者数组（被观察者在被哪些观察者观察）
    }
    attach(observer) {          // 通过 attach 方法，来绑定观察者
        this.observers.push(observer)
    }
    setState(newState) {        // 当被观察者状态更新时，要遍历观察者数组，通知观察者们做更新操作
        this.state = newState
        this.observers.forEach(observer => observer.update(this.name, newState))
    }
}

class Observer{
    constructor(name) {
        this.name = name
    }
    update(subject, newState) {
        console.log(`${this.name}: ${subject}现在${newState}`);
    }
}

let baby = new Subject('小baby')
let father = new Observer('爸爸')
let mother = new Observer('妈妈')

baby.attach(father)
baby.attach(mother)
baby.setState('醒了')