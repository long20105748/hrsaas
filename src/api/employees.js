import request from '@/utils/request'

/**
 * 获取员工的简单列表
 **/
export function getEmployeesSimple() {
    return request({
        url: '/sys/user/simple'
    })
}

/**
 * 获取员工综合列表
 */
export function getEmployeeList(params) {
    return request({
        url: '/sys/user',
        params
    })
}

/**
 * 删除员工
 */
export function delEmployee(id) {
    return request({
        url: `/sys/user/${id}`,
        method: 'DELETE'
    })
}

/**
 * 新增员工
 */
export function addEmployee(data) {
    return request({
        url: '/sys/user',
        method: 'POST',
        data
    })
}

/**
 * 封装员工导入接口
 */
export function importEmployee(data) {
    return request({
        url: '/sys/user/batch',
        method: 'POST',
        data
    })
}

/**
 * 更新用户基本信息
 */
export function saveUserDetailById(data) {
    return request({
        url: `/sys/user/${data.id}`,
        method: 'PUT',
        data
    })
}

/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail(id) {
    return request({
        url: `/employees/${id}/personalInfo`
    })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal(data) {
    return request({
        url: `/employees/${data.userId}/personalInfo`,
        method: 'put',
        data
    })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
    return request({
        url: `/employees/${id}/jobs`
    })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
    return request({
        url: `/employees/${data.userId}/jobs`,
        method: 'put',
        data
    })
}
