import request from '@/utils/request'

export function fetchCommodity(data) {
  return request({
    url: '/goods/getAllGoods',
    method: 'post',
    data
  })
}

export function createCommodity(data) {
  return request({
    url: '/goods/setGoods',
    method: 'post',
    data
  })
}

export function updateCommodity(data) {
  return request({
    url: '/goods/updateGoods',
    method: 'post',
    data
  })
}

export function delCommodity(data) {
  return request({
    url: '/goods/deleteGoods',
    method: 'post',
    data
  })
}

