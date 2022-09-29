// 权限拦截在路由跳转 导航守卫
import router from '@/router'
import store from '@/store' // 引入store实例 和组件中的this.$store是一回事
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 不需要导出只需要执行里面的代码

const whiteList = ['/login', '/404'] // 定义白名单

// 导航前置守卫
router.beforeEach(async(to, from, next) => {
    nprogress.start() // 开启进度条
    if (store.state.user.token) {
        if (to.path === '/login') {
            next('/') // 有token跳到主页
        } else {
            if (!store.getters.userId) {
                // 如果没有ID表示当前没有获取用户信息
                // async函数所 return 用await就可以接收到
                const { roles } = await store.dispatch('user/getUserInfo')
                    // 筛选用户的可用路由
                const routes = await store.dispatch('permission/filterRoutes', roles.menus) // 筛选得到当前用户可用动态路由
                router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加动态路由到路由表
                next(to.path) // 相当于跳转到对应的地址， 相当于多做一次跳转
                    // 为什么要多做一次跳转 路由还没加进去直接跳转报错
            } else {
                next()
            }
        }
    } else {
        if (whiteList.some(path => path === to.path)) {
            next()
        } else {
            next('/login')
        }
    }
    nprogress.done() // 关闭进度条
})

// 导航后置守卫
router.afterEach(() => {
    nprogress.done() // 关闭进度条
})
