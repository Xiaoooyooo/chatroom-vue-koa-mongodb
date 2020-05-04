function http(url, method, data = null, options = {}) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest
    xhr.open(method, url)
    xhr.onload = function () {
      resolve(this.response)
    }
    xhr.onerror = function (err) {
      reject(err)
    }
    xhr.send(data)
  })
}

export default http