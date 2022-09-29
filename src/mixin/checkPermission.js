// 做一个混入对象
import store from '@/store'

export default {
    methods: {
        checkPermission(key) {
            // 去用户信息里面找 points中有没有key 如果有则返回false 表示可以点击
            const { userInfo } = store.state.user
            if (userInfo.roles && userInfo.roles.points) {
                return userInfo.roles.points.some(item => item === key)
            }
            return false
        }
    }
}
