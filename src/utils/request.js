import axios from 'axios'
import { Message } from 'element-ui'

/*
  封装asios
  封装处理配置（路径、时间、token）、统一管理接口、错误处理、不同形式的请求、消息提示、loading等。
*/

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 统一baseURL
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 7000 // 超时时间
})

// 请求拦截
service.interceptors.request.use(
  config => {
    // do something before request is sent

    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// 响应拦截处理
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.headers['content-type'] === 'application/json') {
      const res = response.data
      if (!res.status) {
        Message({
          message: res.msg || '响应发生错误',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(res.msg || '响应发生错误')
      } else {
        return res
      }
    } else {
      return response
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
