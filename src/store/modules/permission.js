// 专门处理权限路由的模块

import { constantRoutes, asyncRoutes } from '@/router'

const state = {
    routes: constantRoutes // 表示当前用户所有可以访问的路由
}
const mutations = {
    // 定义修改routes的mutations
    // payload认为是我们登录成功需要添加的新路由
    setRoutes(state, payload) {
        state.routes = [...constantRoutes, ...payload]
    }
}
const actions = {
    // 第二个参数为当前用户所拥有的访问权限
    filterRoutes(context, menus) {
        // 筛选出动态路由中和menus中能够对上的路由
        const routes = []
        menus.forEach(key => {
                routes.push(...asyncRoutes.filter(item => item.name === key))
            })
            // routes 就是用户可访问的路由
        context.commit('setRoutes', routes)
        return routes // state数据是用来显示菜单的， return是给路由addRouted用的
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
