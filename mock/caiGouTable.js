const Mock = require('mockjs')

const List = []
const count = 22

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    title: '@title(1)',
    buySum: '@integer(10, 500)',
    orderSum: '@integer(10, 500)'
  }))
}

module.exports = [
  {
    url: '/danPinCaiGouBiao/get',
    type: 'get',
    response: config => { // response是个函数 config是个参数
      const { sort } = config.query

      let mockList = List

      if (sort === '-id') { // 降序排序
        mockList = mockList.reverse()
      }

      return {
        code: 20000,
        data: {
          items: mockList
        }
      }
    }
  },

  {
    url: '/danPinCaiGouBiao/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

