import request from '@/utils/request'

export function fetchProvider(data) {
  return request({
    url: '/supplier/getAll',
    method: 'post',
    data
  })
}

export function createProvider(data) {
  return request({
    url: '/supplier/set',
    method: 'post',
    data
  })
}

export function updateProvider(data) {
  return request({
    url: '/supplier/update',
    method: 'post',
    data
  })
}

export function delProvider(data) {
  return request({
    url: '/supplier/delete',
    method: 'post',
    data
  })
}
