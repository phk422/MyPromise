class Promise {
  // Promise实例的状态
  PromiseState = "pending"
  // 保存回调的结果
  PromiseResult = null
  // 用于保存异步任务的回调函数
  callbacks = [] // 保存多个回调
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
      // 处理成功的回调
      this.callbacks.forEach(item => {
        item.onResolved(data)
      })
    }
    // 失败的回调
    const reject = (data) => {
      // 确保成功或者失败的回调只执行一次
      if (this.PromiseState !== "pending") return
      this.PromiseState = "rejected"
      this.PromiseResult = data
      // 处理失败的回调
      this.callbacks.forEach(item => {
        item.onRejected(data)
      })
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
    // 1.判断参数是否是回调函数
    // 1.1异常穿透
    if (typeof onRejected !== 'function') {
      onRejected = (reason) => {
        throw reason
      }
    }
    // 1.2 值传递
    if (typeof onResolved !== 'function') {
      onResolved = value => value
    }
    return new Promise((resolve, reject) => {
      // 封装函数，处理成功和失败的逻辑
      const callback = (type) => {
        const result = type(this.PromiseResult)
        // 判断result是不是Promise对象
        if (result instanceof Promise) {
          result.then(res => {
            resolve(res)
          }, rea => {
            reject(rea)
          })
        } else {
          resolve(result)
        }
      }

      // 判断成功还是失败
      if (this.PromiseState === "fulfilled") {
        // 采用定时异步执行then的回调函数
        setTimeout(() => {
          callback(onResolved)
        })
      }
      // 失败rejected
      if (this.PromiseState === "rejected") {
        // 采用定时异步执行then的回调函数
        setTimeout(() => {
          callback(onRejected)
        })
      }
      // 如果是处于pending状态，则是异步任务
      if (this.PromiseState === "pending") {
        // 保存回调函数
        this.callbacks.push({
          onResolved: () => {
            setTimeout(() => {
              callback(onResolved)
            })
          },
          onRejected: () => {
            setTimeout(() => {
              callback(onRejected)
            })
          }
        })
      }
    })
  }

  /**
   * 处理错误的函数
   * @param {*} onRejected 
   */
  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  /**
   * resovle方法，属于类
   * @param {*} value 
   */
  static resolve(value) {
    return new Promise((resovle, reject) => {
      if (value instanceof Promise) {
        value.then(res => {
          resovle(res)
        }, err => {
          reject(err)
        })
      } else {
        resovle(value)
      }
    })
  }

  /**
   * reject方法,返回结果永远是一个失败的Promise, 失败的结果为传入的参数
   * @param {*} reason 
   */
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

  /**
   * all方法，处理多个Promise
   * Promise.all() 方法接收一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入，并且只返回一个Promise实例， 
   * 那个输入的所有promise的resolve回调的结果是一个数组。这个Promise的resolve回调执行是在所有输入的promise的resolve回调都结束，
   * 或者输入的iterable里没有promise了的时候。它的reject回调执行是，只要任何一个输入的promise的reject回调执行或者输入不合法的promise就会立即抛出错误，
   * 并且reject的是第一个抛出的错误信息。
   * @param {*} promises 
   */
  static all(promises) {
    return new Promise((resolve, reject) => {
      let count = 0
      const arr = []
      for(let i = 0; i < promises.length; i++) {
        promises[i].then(res => {
          arr[i] = res
          count++
          if (count === promises.length) {
            resolve(arr)
          }
        }, err => {
          reject(err)
        })
      }
    })
  }

  /**
   * race方法，传入的Peomises实例，谁先改变状态，谁就是返回的值
   * @param {*} promises 
   */
  static race(promises) {
    return new Promise((resovle, reject) => {
      for(let i = 0; i < promises.length; i++) {
        promises[i].then(res => {
          // 修改返回对象的状态为成功
          resovle(res)
        }, err => {
          // 修改返回对象的状态为失败
          reject(err)
        })
      }
    })
  }
}
