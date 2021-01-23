const Mock = require('mockjs')

const List = []
const count = 43

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    'name|1': ['刘强东', '黄晓明', '李师师', '赵婧', '魏忠贤', '王阳明', '萧炎', '关羽'],
    account: '@title(1)',
    'gender|1': ['女', '男'],
    phone: '@string(number,11)',
    address: '@title(4,7)',
    identity: '@string(number,18)',
    password: '123456',
    'role|1': ['采购经理', '采购员'],
    affiliation: ''
  }))
  List.push(Mock.mock({
    id: '@increment',
    'name|1': ['刘强东', '黄晓明', '李师师', '赵婧', '魏忠贤', '王阳明', '萧炎', '关羽'],

    'gender|1': ['女', '男'],
    phone: '@string(number,11)',
    address: '@title(4,7)',
    identity: '@string(number,18)',
    password: '123456',
    'role|1': ['分店店员'],
    affiliation: '@title(1,2)'
  }))
}

module.exports = [
  {
    url: '/user/getAllUser',
    type: 'get',
    response: config => { // response是个函数 config是个参数
      const { role, name, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (role && item.role !== role) return false
        if (name && item.name.indexOf(name) < 0) return false
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
    url: '/user/setUser',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/user/updateUser',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/user/delUser',
    type: 'post',
    response: config => {
      const account = config.body.account
      return {
        code: 20000,
        data: account
      }
    }
  }
]

