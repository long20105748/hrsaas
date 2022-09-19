import request from '@/utils/request'

/**
 * 获取组织架构数据
 * **/
export function getDepartment() {
    return request({
        url: '/company/department',
        method: 'GET'
    })
}

/**
 * 删除部门
 * **/
export function deleteDepartmentById(id) {
    return request({
        url: `/company/department/${id}`,
        method: 'DELETE'
    })
}

/**
 * 新增部门
 * **/
export function addDepartment(data) {
    return request({
        url: '/company/department',
        method: 'POST',
        data
    })
}

/**
 * 修改部门
 * **/
export function editDepartment(data) {
    return request({
        url: `/company/department/${data.id}`,
        method: 'PUT',
        data
    })
}

/**
 * 获取部门详情
 **/
export function getDepartDetail(id) {
    return request({
        url: `/company/department/${id}`
    })
}
