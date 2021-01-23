import request from '@/utils/request'

export function fetchTotal() {
  return request({
    url: '/stat/total',
    method: 'get',
  })
}

export function fetchTodoNum() {
  return request({
    url: '/stat/todo_num',
    method: 'get',
  })
}
export function fetchClerkNum() {
  return request({
    url: '/stat/shop_man_num',
    method: 'get',
  })
}
export function fetchBuyTotal() {
  return request({
    url: '/stat/buy_total',
    method: 'get',
  })
}
export function fetchBuyingManNum() {
  return request({
    url: '/stat/buying_man_num',
    method: 'get',
  })
}
export function fetchWaitingShopNum() {
  return request({
    url: '/stat/waiting_shop_num',
    method: 'get',
  })
}
