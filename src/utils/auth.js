const logined = 'logined'

export function getToken() {
  return localStorage.getItem(logined)
}

export function setToken(value) {
  return localStorage.setItem(logined, value)
}

export function removeToken() {
  return localStorage.removeItem(logined)
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
