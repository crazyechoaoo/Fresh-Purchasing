const Mock = require('mockjs')

const List = []
const count = 143

for (let i = 0; i < count; i++) {
  const comment = []
  for (let j = 0; j < 4; j++) {
    comment.push(Mock.mock({
      time: +Mock.Random.date('T'),
      'sender|1': ['刘强东', '黄晓明', '李师师', '赵婧', '魏忠贤', '王阳明', '萧炎', '关羽'],
      content: '@sentence(5,10)'
    }))
  }
  const table = []
  for (let j = 0; j < 51; j++) {
    table.push(Mock.mock({
      id: '@increment',
      'title|1': ['清远店', '沈阳店', '广州店', '神州店', '上海店', '北京店', '东京店', '西川店', '珠海店', '新疆店', '西藏店', '南京店', '太原店'],
      'orderUnit|1': ['斤', '公斤', '件'],
      'orderNum|1': '@integer(2, 200)',
      'buyUnit|1': ['斤', '公斤', '件'],
      'buyNum|1': '@integer(2, 200)',
      price: '@integer(2, 200)'
    }))
  }
  List.push(Mock.mock({
    id: '@increment',
    time: +Mock.Random.date('T'),
    'commdityType|1': ['水果', '蔬菜', '冷冻品'],
    commdityId: '@integer(1, 5000)',
    'title|1': ['苹果', '香蕉', '鱼肉', '香菜', '白菜', '河蟹', '小鸟', '橙子', '橘子', '柚子', '牛肉', '丸子', '猪肉', '葡萄', '菜心', '油麦菜', '玉米', '排骨'],
    'orderUnit|1': ['斤', '公斤', '件'],
    'sellUnit|1': ['斤', '公斤', '件'],
    'receiveUnit|1': ['斤', '公斤', '件'],
    'status|1': ['等待采购', '等待发布', '采购完成'],
    'provider|1': ['清远基地', '农村', '郊区', '养殖市场', '小小公司', '星露谷'],
    'manager|1': ['刘强东', '黄晓明', '李师师', '赵婧', '魏忠贤', '王阳明', '萧炎', '关羽'],
    'buyer|1': ['刘强东', '黄晓明', '李师师', '赵婧', '魏忠贤', '王阳明', '萧炎', '关羽'],
    buySum: '@integer(10, 500)',
    orderSum: '@integer(10, 500)',
    total: '@integer(200, 10000)',
    price: '@integer(2, 300)',
    comment,
    table
  }))
}

//  方案schemeList 方案表schemeTable
const schemeList = []
const schemeCount = 15

for (let i = 0; i < schemeCount; i++) {
  const schemeTable = []
  for (let j = 0; j < 51; j++) {
    schemeTable.push(Mock.mock({
      id: '@increment',
      'title|1': ['苹果', '香蕉', '鱼肉', '香菜', '白菜', '河蟹', '小鸟', '橙子', '橘子', '柚子', '牛肉', '丸子', '猪肉', '葡萄', '菜心', '油麦菜', '玉米', '排骨'],
      'buyer|1': ['刘强东', '黄晓明', '李师师', '赵婧', '魏忠贤']
    }))
  }
  schemeList.push(Mock.mock({
    id: '@increment', // 方案号
    title: '@title(1,2)', // 方案名
    desc: '@sentence(5,10)', // 方案说明
    table: schemeTable // 方案表
  }))
}

module.exports = [
  {
    url: '/single_order/getAll',
    type: 'get',
    response: config => { // response是个函数 config是个参数
      const { title, page = 1, limit = 20, sort, timeBegin, timeEnd } = config.query
      // timeBegin ~ timeEnd：
      // 只传了timeBegin返回当天的采购单
      // 传了两个返回范围内的采购单
      const timeBe = new Date(timeBegin).getTime()
      const timeEn = new Date(timeEnd).getTime()

      let mockList = List.filter(item => {
        if (title && item.title.indexOf(title) < 0) return false
        if (timeBegin) {
          if (timeEnd) {
            if (item.time > timeEn || item.time < timeBe) return false
          } else {
            if (item.time < timeBe) return false
          }
        }
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
    url: '/single_order/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/single_order/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/single_order/delete',
    type: 'post',
    response: config => {
      const id = config.body.id
      return {
        code: 20000,
        data: id
      }
    }
  },

  { // 订购方案 get
    url: '/buy_plan/get',
    type: 'get',
    response: config => { // response是个函数 config是个参数
      const { title, page = 1, limit = 20, sort } = config.query

      let mockList = schemeList.filter(item => {
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

  { // 订购方案 update
    url: '/buy_plan/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  { // 订购方案 del
    url: '/buy_plan/del',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  { // 订购方案 create
    url: '/buy_plan/set',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

