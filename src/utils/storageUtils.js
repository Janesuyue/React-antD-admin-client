/**
 * 进行local数据存储管理的工具模块
 */

import store from 'store'

//  定义一个常量避免loaclStorage中的key值出错,key需要保持一致
const USER_KEY = 'user_key'

export default {
    /**
     * 保存user
     */
    saveUser(user) {
        // localStorage.setItem(USER_KEY, JSON.stringify(user))
        store.set(USER_KEY,user)
    },

    /**
     * 读取
     */
    getUser() {
        // 如果localStorage中有值返回loacl中存的对象,否则返回一个空对象
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY) || {}
    },

    /**
     * 删除
     */
    removeUser() {
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}
