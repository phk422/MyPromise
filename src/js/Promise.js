class Promise {
  PromiseState = "pending"
  PromiseResult = null
  constructor(executor) {
    // 改变Promise实例的状态，保存执行的结果
    const resolve = (data) => {
      // 修改状态
      this.PromiseState = "fulfilled"
      // 保存数据
      this.PromiseResult = data
    }
    const reject = (data) => {
      this.PromiseState = "rejected"
      this.PromiseResult = data
    }
    // 创建Promise对象时，同步执行回调函数
    try {
      executor(resolve, reject)
    } catch (error) {
      // 如果出现异常直接调用reject方法进行处理
      reject(error)
    }
  }

  then(onResolved, onRejected) {

  }
}