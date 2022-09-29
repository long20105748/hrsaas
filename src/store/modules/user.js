import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'

const state = {
    token: getToken('hrsaas-ihrm-token') || null,
    userInfo: {}
}
const mutations = {
    setToken(state, token) {
        state.token = token
        setToken(token)
    },
    removeToken(state) {
        state.token = null
        removeToken()
    },
    setUserInfo(state, userInfo) {
        state.userInfo = userInfo
    },
    removeUserInfo(state) {
        state.userInfo = {}
    }
}
const actions = {
    async login(context, data) {
        // 调用api接口
        const token = await login(data)
        context.commit('setToken', token)

        // 存放登录时的时间戳
        setTimeStamp(Date.now())
    },
    async getUserInfo(context) {
        const data = await getInfo()
        const { staffPhoto } = await getUserDetailById(data.userId)
        const baseData = { staffPhoto, ...data }
        context.commit('setUserInfo', baseData)
            // console.log(baseData)
        return data
    },
    logout(context) {
        context.commit('removeUserInfo')
        context.commit('removeToken')
            // 重置路由
        resetRouter()
            // 去设置权限模块下路由为初始状态
            // Vuex 子模块怎么调用子模块的action 都没加锁的情况下可以随意调用
            // 不加命名空间的条件下 所有的mutations和action都是挂载全局上
            // 加了命名空间的模块 context指的不是全局的context
            // mutations名称 载荷 payload 第三个参数{root: true}表示 调用根级的mutations, action
        context.commit('permission/setRoutes', [], { root: true })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
