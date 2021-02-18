class Promise {
  PromiseState = "pending"
  PromiseResult = null
  constructor(executor) {
    // 改变Promise实例的状态，保存执行的结果
    const resolve = (data) => {
      this.PromiseState = "fulfilled"
      this.PromiseResult = data
    }
    const reject = (data) => {
      this.PromiseState = "fulfilled"
      this.PromiseResult = data
    }
    // 创建Promise对象时，同步执行回调函数
    executor(resolve, reject)
  }

  then(onResolved, onRejected) {

  }
}