const Mock = require('mockjs')

// 分店采购单List
const List = []
const count = 143

for (let i = 0; i < count; i++) {
  const comment = []
  for (let j = 0; j < 1; j++) {
    comment.push(Mock.mock({
      time: +Mock.Random.date('T'),
      sender: '@title(1)',
      content: '@sentence(5,10)'
    }))
  }
  const table = []
  for (let j = 0; j < 51; j++) {
    table.push(Mock.mock({
      id: '@increment',
      title: '@title(1,2)',
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
    'title|1': ['清远店', '沈阳店', '广州店', '神州店', '上海店', '北京店', '东京店', '西川店', '珠海店', '新疆店', '西藏店', '南京店', '太原店'],
    'submitter|1': ['刘强东', '黄晓明', '李师师', '赵婧', '魏忠贤'],
    'status|1': ['等待审批', '审批通过', '采购中', '货品运送中', '订单完成'],
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
      title: '@title(1,2)',
      'orderUnit|1': ['斤', '公斤', '件'],
      'orderNum|1': '@integer(2, 200)',
      'buyUnit|1': ['斤', '公斤', '件'],
      'buyNum|1': '@integer(2, 200)',
      price: '@integer(2, 200)'
    }))
  }
  schemeList.push(Mock.mock({
    id: '@increment',
    title: '@title(1,2)',
    desc: '@sentence(5,10)',
    table: schemeTable
  }))
}

module.exports = [
  { // 分店采购单 get
    url: '/shop_order/getAll',
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

  { // 分店采购单 create
    url: '/shop_order/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  { // 分店采购单 update
    url: '/shop_order/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  { // 分店采购单 del
    url: '/shop_order/delete',
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
    url: '/orderPlan/get',
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
    url: '/orderPlan/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  { // 订购方案 del
    url: '/orderPlan/del',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  { // 订购方案 create
    url: '/orderPlan/set',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  { // 生成单品采购单
    url: '/shop_order/make',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  { // 批准分店订购单
    url: '/shop_order/approve',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

