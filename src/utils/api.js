class Api {
  constructor() {

  }
  getlayer() {
    return new Promise((resolve, reject) => {
      querylayers()
        .then((res) => {
          resolve(res)
        })
        .catch((res) => {
          reject(res)
        })
    })
  }
}
export default new Api()

