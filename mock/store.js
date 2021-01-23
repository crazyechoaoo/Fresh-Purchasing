const Mock = require('mockjs')

const List = []
const count = 43

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    title: '@name(2,4)',
    phone: '@string(number,11)',
    address: '@title(4,7)'
  }))
}

module.exports = [
  {
    url: '/shop/getAllShop',
    type: 'get',
    response: config => { // response是个函数 config是个参数
      const { title, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') { // 降序排序
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/shop/setShop',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/shop/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/shop/del',
    type: 'post',
    response: config => {
      const id = config.body.id
      return {
        code: 20000,
        data: id
      }
    }
  }
]

