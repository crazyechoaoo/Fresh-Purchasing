const Mock = require('mockjs')
const { param2Obj } = require('./utils')

const user = require('./user')
const commodity = require('./commodity')
const provider = require('./provider')
const account = require('./account')
const store = require('./store')
const single = require('./single')
const branch = require('./branch')
const caiGouTable = require('./caiGouTable')

const mocks = [
  ...user,
  ...commodity,
  ...provider,
  ...account,
  ...store,
  ...single,
  ...caiGouTable,
  ...branch
]

// for front mock
// please use it cautiously, it will redefine XMLHttpRequest,
// which will cause many of your third-party libraries to be invalidated(like progress event).
function mockXHR() {
  // mock patch
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap(respond) {
    return function(options) {
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options // options是指向本次请求的Ajax选项集，含有url、type和body 3个属性
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url)
        })
      } else {
        result = respond
      }
      return Mock.mock(result) // 生成数据result
    }
  }

  for (const i of mocks) {
    // 拦截请求 mock(链接,方法,函数)
    Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))
  }
}

module.exports = {
  mocks,
  mockXHR
}

