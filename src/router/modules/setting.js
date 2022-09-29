import Layout from '@/layout'

// 员工的路由规则
export default {
    // 路由规则
    path: '/settings',
    name: 'settings',
    component: Layout,
    children: [{
        path: '', // 默认路由
        component: () =>
            import ('@/views/setting'),
        meta: {
            title: '设置',
            icon: 'setting'
        }
    }]
}
