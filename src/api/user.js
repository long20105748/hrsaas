import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/sys/login',
        method: 'POST',
        data
    })
}

/**
 *  获取用户登录信息
 * **/
export function getInfo(token) {
    return request({
        method: 'POST',
        url: '/sys/profile'
    })
}

export function logout() {

}

/**
 *  获取员工基本信息
 **/
export function getUserDetailById(id) {
    return request({
        method: 'GET',
        url: `/sys/user/${id}`
    })
}
