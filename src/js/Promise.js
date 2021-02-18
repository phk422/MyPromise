class Promise {
  // Promise实例的状态
  PromiseState = "pending"
  // 保存回调的结果
  PromiseResult = null
  constructor(executor) {
    // 改变Promise实例的状态，保存执行的结果
    // 成功的回调
    const resolve = (data) => {
      // 确保成功或者失败的回调只执行一次
      if (this.PromiseState !== "pending") return
      // 修改状态
      this.PromiseState = "fulfilled"
      // 保存数据
      this.PromiseResult = data
    }
    // 失败的回调
    const reject = (data) => {
      // 确保成功或者失败的回调只执行一次
      if (this.PromiseState !== "pending") return
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

  /**
   * 用于处理成功或者失败的结果
   * @param {*} onResolved 成功的回调函数
   * @param {*} onRejected 失败的回调函数
   */
  then(onResolved, onRejected) {
    // 判断成功还是失败
    if (this.PromiseState === "fulfilled") {
      onResolved(this.PromiseResult)
    }
    // 失败rejected
    if (this.PromiseState === "rejected") {
      onRejected(this.PromiseResult)
    }

  }
}