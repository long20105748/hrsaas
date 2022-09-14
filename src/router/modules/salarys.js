import Layout from '@/layout'

// 员工的路由规则
export default {
    // 路由规则
    path: '/salarys',
    name: 'salarys',
    component: Layout,
    children: [{
        path: '', // 默认路由
        component: () =>
            import ('@/views/salarys'),
        meta: {
            title: '工资',
            icon: 'money'
        }
    }]
}
