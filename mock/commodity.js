const Mock = require('mockjs')

const List = []
const count = 1000

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    'title|1': ['苹果', '香蕉', '鱼肉', '香菜', '白菜', '河蟹', '小鸟', '橙子', '橘子', '柚子', '牛肉', '丸子', '猪肉', '葡萄', '菜心', '油麦菜', '玉米', '排骨'],
    'type|1': ['水果', '蔬菜', '冷冻品'],
    'orderUnit|1': ['斤', '公斤', '件'],
    'sellUnit|1': ['斤', '公斤', '件'],
    'receiveUnit|1': ['斤', '公斤', '件'],
    key: '@integer(300, 5000)',
    value: '1516546'
  }))
}

module.exports = [
  {
    url: '/goods/getAllGoods',
    type: 'get',
    response: config => { // response是个函数 config是个参数
      const { type, title, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (type && item.type !== type) return false
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
    url: '/goods/setGoods',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/goods/updateGoods',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/goods/deleteGoods',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

