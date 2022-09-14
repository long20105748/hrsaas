import Layout from '@/layout'

// 员工的路由规则
export default {
    // 路由规则
    path: '/departments',
    name: 'departments',
    component: Layout,
    children: [{
        path: '', // 默认路由
        component: () =>
            import ('@/views/departments'),
        meta: {
            title: '组织架构',
            icon: 'tree'
        }
    }]
}
