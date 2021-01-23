import request from '@/utils/request'

export function fetchTable(query) {
  return request({
    url: '/danPinCaiGouBiao/get',
    method: 'get',
    params: query
  })
}

export function updateTable(data) {
  return request({
    url: '/danPinCaiGouBiao/update',
    method: 'post',
    data
  })
}
