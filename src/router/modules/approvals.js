import Layout from '@/layout'

// 员工的路由规则
export default {
    // 路由规则
    path: '/approvals',
    name: 'approvals',
    component: Layout,
    children: [{
        path: '', // 默认路由
        component: () =>
            import ('@/views/approvals'),
        meta: {
            title: '审批',
            icon: 'tree-table'
        }
    }]
}
