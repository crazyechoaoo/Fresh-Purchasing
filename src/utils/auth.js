import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserInfo() {
  return JSON.parse(sessionStorage.getItem('info'))
}

export function setUserInfo(info) {
  return sessionStorage.setItem('info', JSON.stringify(info))
}

export function removeUserInfo() {
  return sessionStorage.clear()
}
