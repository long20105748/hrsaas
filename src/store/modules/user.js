import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getInfo, getUserDetailById } from '@/api/user'

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
        console.log(baseData)
        return data
    },
    logout(context) {
        context.commit('removeUserInfo')
        context.commit('removeToken')
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
