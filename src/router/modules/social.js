import Layout from '@/layout'

// 员工的路由规则
export default {
    // 路由规则
    path: '/social',
    name: 'social',
    component: Layout,
    children: [{
        path: '', // 默认路由
        component: () =>
            import ('@/views/social'),
        meta: {
            title: '社保',
            icon: 'table'
        }
    }]
}
