import request from '@/utils/request'

// 订购单获取
export function fetchBranch(data) {
  return request({
    url: '/shop_order/getAll',
    method: 'post',
    data
  })
}

// 订购单创建
export function createBranch(data) {
  return request({
    url: '/shop_order/create',
    method: 'post',
    data
  })
}

// 订购单更新
export function updateBranch(data) {
  return request({
    url: '/shop_order/update',
    method: 'post',
    data
  })
}

// 订购单删除
export function delBranch(data) {
  return request({
    url: '/shop_order/delete',
    method: 'post',
    data
  })
}

export function printBranch(data) {
  return request({
    url: '/shop_order/printOne',
    method: 'get',
    params: data,
    responseType: 'blob' //! !!!!!下载文件必须要写这个参数！！！！！
  })
}

// 获取订购方案
export function fetchScheme(data) {
  return request({
    url: '/orderPlan/get',
    method: 'post',
    data
  })
}

export function updateScheme(data) {
  return request({
    url: '/orderPlan/update',
    method: 'post',
    data
  })
}

export function delScheme(data) {
  return request({
    url: '/orderPlan/delete',
    method: 'post',
    data
  })
}

export function createScheme(data) {
  return request({
    url: '/orderPlan/set',
    method: 'post',
    data
  })
}

// 生成单品采购单
export function makeSingle(data) {
  return request({
    url: '/single_order/create',
    method: 'post',
    data
  })
}

// 批准分店订购单
export function approveBranch(data) {
  return request({
    url: '/shop_order/approve',
    method: 'post',
    data
  })
}

export function finishBranch(data) {
  return request({
    url: '/shop_order/confirm',
    method: 'post',
    data
  })
}
