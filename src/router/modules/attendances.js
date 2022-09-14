import Layout from '@/layout'

// 员工的路由规则
export default {
    // 路由规则
    path: '/attendances',
    name: 'attendances',
    component: Layout,
    children: [{
        path: '', // 默认路由
        component: () =>
            import ('@/views/attendances'),
        meta: {
            title: '考勤',
            icon: 'skill'
        }
    }]
}
