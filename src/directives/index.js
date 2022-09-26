export const imgerror = {
    // 指令对象 会在dom元素插入到节点后执行
    inserted(dom, options) {
        dom.src = dom.src || options.value
            // dom 表示当前的指令作用的dom对象
            // option 表示指令中变量的解释 其中有一个属性叫做value
            // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的是一个事件 => onerror
        dom.onerror = function() {
            // 当图片出现异常的时候， 会将指令的默认值设置为该图片路径
            dom.src = options.value
        }
    },
    componentUpdated(dom, options) {
        // 该钩子函数会在当前指令作用的组件更新完毕后执行
        // inserted只会执行一次
        dom.src = dom.src || options.value
    }
}
