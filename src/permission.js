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
                await store.dispatch('user/getUserInfo')
            }
            next()
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
