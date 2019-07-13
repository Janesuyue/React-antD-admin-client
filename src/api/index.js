/**
 * 要求:能根据接口文档定义接口请求
 * 包含应用中所有接口请求函数的模块
 * 每个函数的返回值的是promise
 */

import ajax from './Ajax'

//  登录
// export function reqLogin(username, password) {
//     return ajax('./login',{username,password},'POST')
// }

export const reqLogin = (userName, password) => ajax('/api/v1/auth/manager_login', { userName, password }, 'POST')