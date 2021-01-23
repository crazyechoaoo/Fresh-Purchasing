import request from '@/utils/request'

export function fetchAccount(data) {
  return request({
    url: '/user/getAllUser',
    method: 'post',
    data
  })
}

export function createAccount(data) {
  return request({
    url: '/user/setUser',
    method: 'post',
    data
  })
}

export function updateAccount(data) {
  return request({
    url: '/user/updateUser',
    method: 'post',
    data
  })
}

export function delAccount(data) {
  return request({
    url: '/user/delUser',
    method: 'post',
    data
  })
}
