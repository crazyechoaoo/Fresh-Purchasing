import Vue from 'vue'
import Router from 'vue-router'

// CommonJS 环境下 要显式的通过全局方法 Vue.use() 使用插件。
Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},

{
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
},

{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [{
    path: 'dashboard',
    component: () => import('@/views/dashboard/index'),
    name: 'Dashboard',
    meta: {
      title: '首页',
      icon: 'home',
      affix: true
    }
  }]
},

{
  path: '/profile',
  component: Layout,
  redirect: '/profile/index',
  hidden: true,
  children: [{
    path: 'index',
    component: () => import('@/views/profile/index'),
    name: 'Profile',
    meta: {
      title: '个人信息',
      icon: 'user',
      noCache: true
    }
  }]
}
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
  path: '/commodity',
  component: Layout,
  meta: {
    roles: ['shop', 'buyer', 'manager']
  },
  children: [{
    path: 'index',
    component: () => import('@/views/commodity/index'),
    name: 'Commodity',
    meta: {
      title: '货品管理',
      icon: 'apple-fill'
    },
    roles: ['shop', 'buyer', 'manager']
  }]
},

{
  path: '/entry',
  component: Layout,
  // redirect: '/entry/single',
  redirect: 'noRedirect',
  alwaysShow: false, // will always show the root menu
  name: 'Entry',
  meta: {
    title: '采购管理',
    icon: '单',
    roles: ['shop', 'buyer', 'manager'] // you can set roles in root nav
  },
  children: [{
    path: 'orderPlan',
    component: () => import('@/views/entry/orderScheme/index'),
    name: 'OrderScheme',
    meta: {
      title: '订购方案',
      roles: ['shop', 'manager']
    }
  },
  {
    path: 'buyPlan',
    component: () => import('@/views/entry/buyScheme/index'),
    name: 'BuyScheme',
    meta: {
      title: '分配方案',
      roles: ['manager']
    }
  },
  {
    path: 'single',
    component: () => import('@/views/entry/single/index'), // Parent router-view
    name: 'Single',
    meta: {
      title: '单品采购单',
      roles: ['buyer', 'manager']
    }
  },
  {
    path: 'branch',
    component: () => import('@/views/entry/branch/index'),
    name: 'Branch',
    meta: {
      title: '分店订购单',
      roles: ['shop', 'manager']
    }
  }
  ]
},

{
  path: '/store',
  component: Layout,
  meta: {
    roles: ['manager'] // you can set roles in root nav
  },
  children: [{
    path: 'index',
    component: () => import('@/views/store/index'),
    name: 'Store',
    meta: {
      title: '分店管理',
      icon: 'store'
    },
    roles: ['manager']
  }]
},

{
  path: '/account',
  component: Layout,
  meta: {
    roles: ['admin'] // you can set roles in root nav
  },
  children: [{
    path: 'index',
    component: () => import('@/views/account/index'),
    name: 'Account',
    meta: {
      title: '账户管理',
      icon: 'account'
    },
    roles: ['admin']
  }]
},

{
  path: '/provider',
  component: Layout,
  meta: {
    roles: ['manager', 'buyer'] // you can set roles in root nav
  },
  children: [{
    path: 'index',
    component: () => import('@/views/provider/index'),
    name: 'Provider',
    meta: {
      title: '供应商管理',
      icon: '供应商'
    },
    roles: ['manager', 'buyer']
  }]
},

// 404 page must be placed at the end !!!
{
  path: '*',
  redirect: '/',
  hidden: true
}
]

const createRouter = () => new Router({
  mode: 'hash',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
