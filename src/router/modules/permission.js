import Layout from '@/layout'

// 员工的路由规则
export default {
    // 路由规则
    path: '/permission',
    name: 'permission',
    component: Layout,
    children: [{
        path: '', // 默认路由
        component: () =>
            import ('@/views/permission'),
        meta: {
            title: '权限管理',
            icon: 'lock'
        }
    }]
}
