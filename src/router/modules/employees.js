import Layout from '@/layout'

// 员工的路由规则
export default {
    // 路由规则
    path: '/employees',
    name: 'employees',
    component: Layout,
    children: [{
        path: '', // 默认路由
        component: () =>
            import ('@/views/employees'),
        meta: {
            title: '员工管理',
            icon: 'people'
        }
    }, {
        path: 'detail/:id',
        component: () =>
            import ('@/views/employees/detail'),
        hidden: true,
        mete: {
            title: '员工详情'
        }
    }]
}
