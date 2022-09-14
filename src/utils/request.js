import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
const TimeOut = 7200000 // 定义超时事件 2小时 单位为ms

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API // /dev-api  /prod-api
})

// 请求拦截器
service.interceptors.request.use(config => {
    // config 是请求配置信息 必须返回
    // 注入token
    if (store.getters.token) {
        if (checkTimeout()) {
            store.dispatch('user/logout') // 登出操作
                // 跳转到登录页
            router.push('/login')
            return Promise.reject(new Error('用户信息已过期'))
        }
        config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config
}, error => {
    return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
    const { success, message, data } = response.data
    if (success) {
        return data
    } else {
        Message.error(message) // 提示错误消息
        return Promise.reject(new Error(message))
    }
}, error => {
    if (error.response && error.response.data && error.response.data.code === 10002) {
        store.dispatch('user/logout')
        router.push('/login')
    } else {
        Message.error(error.message)
    }
    return Promise.reject(error) // 返回执行错误，让当前执行链跳出成功直接进入catch
})

function checkTimeout() {
    return Date.now() - getTimeStamp() >= TimeOut
}

export default service
