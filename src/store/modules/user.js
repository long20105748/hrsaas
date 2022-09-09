import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'

const state = {
    token: getToken('hrsaas-ihrm-token') || null
}
const mutations = {
    setToken(state, token) {
        state.token = token
        setToken(token)
    },
    removeToken(state) {
        state.token = null
        removeToken()
    }
}
const actions = {
    async login(context, data) {
        // 调用api接口
        const token = await login(data)
        context.commit('setToken', token)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
