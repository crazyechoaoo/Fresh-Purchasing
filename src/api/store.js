import request from '@/utils/request'

export function fetchStore(data) {
  return request({
    url: '/shop/getAllShop',
    method: 'post',
    data
  })
}

export function createStore(data) {
  return request({
    url: '/shop/setShop',
    method: 'post',
    data
  })
}

export function updateStore(data) {
  return request({
    url: '/shop/update',
    method: 'post',
    data
  })
}

export function delStore(data) {
  return request({
    url: '/shop/del',
    method: 'post',
    data
  })
}
