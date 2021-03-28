import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth' // 获取token
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
  showSpinner: false
})

const whiteList = ['/login'] // 登陆页面不用拦截

// 全局前置守卫：实现登陆拦截
router.beforeEach(async (to, from, next) => {
  // to: Route: 即将要进入的目标路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子
  // next():进入管道中的下一个钩子，如果全部的钩子执行完了，则导航的状态就是comfirmed（确认的）
  // next(false): 中断当前的导航
  // next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 通过token判断是否登陆了
  const hasToken = getToken()
  if (hasToken) {
    // logged in.
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      // 是否获得角色信息？
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户角色信息
          await store.dispatch('user/addRouter')
          // 根据角色获取动态路由
          const accessRoutes = await store.dispatch(
            'permission/generateRoutes',
            store.getters.roles
          )
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true }) // replace 导航后不会留下 history 记录
        } catch (error) {
          // remove token and go to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || '获取用户信息失败')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没登陆（没token）
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

// 全局后置钩子
// 不会接受 next 函数。也不会改变导航本身
router.afterEach(() => {
  NProgress.done()
})
