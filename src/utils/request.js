import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API // /dev-api  /prod-api
})

// 请求拦截器
service.interceptors.request.use()

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
    Message.error(error.message)
    return Promise.reject(error) // 返回执行错误，让当前执行链跳出成功直接进入catch
})

export default service
