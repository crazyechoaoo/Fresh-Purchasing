
const tokens = {
  administrator: {
    token: 'administrator-token'
  },
  manager: {
    token: 'manager-token'
  },
  buyer: {
    token: 'buyer-token'
  },
  clerk: {
    token: 'clerk-token'
  }
}

const users = {
  'administrator-token': {
    roles: ['administrator'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: '一个管理员',
    gender: '男',
    password: '123456',
    account: 'abcd1234',
    phone: '12345678901',
    address: '一个地址',
    identity: '123456789012345678'
  },
  'manager-token': {
    roles: ['manager'],
    introduction: 'I am an manager',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: '一个采购经理',
    gender: '男',
    password: '123456',
    account: 'abcd1234',
    phone: '12345678901',
    address: '一个地址',
    identity: '123456789012345678'
  },
  'buyer-token': {
    roles: ['buyer'],
    introduction: 'I am an buyer',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: '一个采购员',
    gender: '男',
    password: '123456',
    account: 'abcd1234',
    phone: '12345678901',
    address: '一个地址',
    identity: '123456789012345678'
  },
  'clerk-token': {
    roles: ['clerk'],
    introduction: 'I am an clerk',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: '分店店员',
    affiliation: { id: 199, title: '一个店名' }, // 分店员工所属分店的id和店名
    gender: '男',
    password: '123456',
    account: 'abcd1234',
    phone: '12345678901',
    address: '一个地址',
    identity: '123456789012345678'
  }
}

module.exports = [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]
      // mock error
      if (!token) {
        return {
          code: 60204,
          message: '账号或密码错误'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: '无法找到用户信息'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
