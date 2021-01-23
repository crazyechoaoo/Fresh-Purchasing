import request from '@/utils/request'

export function fetchSingle(data) {
  return request({
    url: '/single_order/getAll',
    method: 'post',
    data
  })
}

export function createSingle(data) {
  return request({
    url: '/single_order/create',
    method: 'post',
    data
  })
}

export function updateSingle(data) {
  return request({
    url: '/single_order/update',
    method: 'post',
    data
  })
}

export function delSingle(data) {
  return request({
    url: '/single_order/delete',
    method: 'post',
    data
  })
}

// 获取订购方案
export function fetchScheme(data) {
  return request({
    url: '/buy_plan/getAll',
    method: 'post',
    data
  })
}

export function fetchAllbuyer() {
  return request({
    url: '/user/getAllBuyer',
    method: 'get'
  })
}

export function updateScheme(data) {
  return request({
    url: '/buy_plan/update',
    method: 'post',
    data
  })
}

export function delScheme(data) {
  return request({
    url: '/buy_plan/delete',
    method: 'post',
    data
  })
}

export function createScheme(data) {
  return request({
    url: '/buy_plan/set',
    method: 'post',
    data
  })
}

// 发配任务
export function assignSingle(data) {
  return request({
    url: '/single_order/distribute',
    method: 'post',
    data
  })
}

// 完成任务
export function finishSingle(data) {
  return request({
    url: '/single_order/finish',
    method: 'post',
    data
  })
}
