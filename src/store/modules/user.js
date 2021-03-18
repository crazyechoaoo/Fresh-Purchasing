import {
  login,
  logout,
  updateUser
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken,
  setUserInfo,
  removeUserInfo,
  getUserInfo
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    gender: '',
    password: '',
    account: '', // 账号
    phone: '',
    address: '', // 地址
    identity: '', // 身份证
    role: '',
    shop_id: '',
    shop_name: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_SHOPID: (state, shop_id) => {
    state.shop_id = shop_id
  },
  SET_SHOPNAME: (state, shop_name) => {
    state.shop_name = shop_name
  },
  SET_GENDER: (state, gender) => {
    state.gender = gender
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_ADDRESS: (state, address) => {
    state.address = address
  },
  SET_IDENTITY: (state, identity) => {
    state.identity = identity
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      username,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password
      }).then(response => {
        if (response.status.toString() === 'success') {
          const {
            user
          } = response
          const data = user
          data.token = 'a-fake-token'
          commit('SET_TOKEN', data.token)

          setUserInfo(data)
          setToken(data.token)
        }
        resolve(response)
      }).catch(error => {
        // 登录失败
        reject(error)
      })
    })
  },

  update({
    commit
  }, userInfo) {
    const username = userInfo.account
    const name = userInfo.name
    const role = userInfo.role
    const gender = userInfo.gender
    const phone = userInfo.phone
    const addr = userInfo.address
    const id_card = userInfo.identity
    const shop_id = userInfo.shop_id
    const shop_name = userInfo.shop_name
    const password = userInfo.password
    return new Promise((resolve, reject) => {
      const data = {
        username,
        name,
        role,
        gender,
        phone,
        addr,
        id_card,
        shop_id,
        shop_name,
        password
      }
      updateUser(data).then(response => {
        setUserInfo(data)
        commit('SET_ROLES', [data.role])
        commit('SET_NAME', data.name)
        commit('SET_SHOPID', data.shop_id)
        commit('SET_SHOPNAME', data.shop_name)
        commit('SET_GENDER', data.gender)
        commit('SET_ACCOUNT', data.username)
        commit('SET_PHONE', data.phone)
        commit('SET_ADDRESS', data.addr)
        commit('SET_IDENTITY', data.id_card)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info => add Router
  addRouter({
    commit
  }) {
    return new Promise((resolve) => {
      const data = getUserInfo()
      commit('SET_ROLES', [data.role])
      commit('SET_NAME', data.name)
      commit('SET_SHOPID', data.shop_id)
      commit('SET_SHOPNAME', data.shop_name)
      commit('SET_GENDER', data.gender)
      commit('SET_ACCOUNT', data.username)
      commit('SET_PHONE', data.phone)
      commit('SET_ADDRESS', data.addr)
      commit('SET_IDENTITY', data.id_card)
      resolve(data)
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        removeUserInfo()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
