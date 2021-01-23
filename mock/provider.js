const Mock = require('mockjs')

const List = []
const count = 143

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    'title|1': ['清远基地', '农村', '郊区', '养殖市场', '小小公司', '星露谷'],
    phone: '@string(number,11)',
    desc: '@sentence()'
  }))
}

module.exports = [
  {
    url: '/supplier/getAll',
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
    url: '/supplier/set',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/supplier/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/supplier/delete',
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

