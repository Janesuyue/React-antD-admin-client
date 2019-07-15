/**
 * 能发布异步ajax请求的函数模块
 * 封装axios库
 * 函数返回值是promise对象
 * 1)优化:统一处理请求异常
 *      在外层包一个自己创建的promise对象
 *      在请求出错时,不reject(error),而是显示错误提示
 * 2)优化:异步得到不是reponse,而是reponse.data
 *       在请求成功resolve时:resolve(reponse.data)
 */

import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data = {}, type = "GET") {

    return new Promise((resolve, reject) => {
        // 1)执行异步ajax请求
        // 2)如果成功了,调用resolve(value)
        // 3)如果失败了,不调用reject(value),而是提示异常信息

        let promise
        // 1)执行异步ajax请求
        if (type === 'GET') {
            promise = axios.get(url, {
                params: data
            })
        } else {
            promise = axios.post(url, data)
        }

        promise.then(response => {
            // 2)如果成功了,调用resolve(value)
            resolve(response.data)

        }).catch(error => {
            // 3)如果失败了,不调用reject(value),而是提示异常信息
            message.error('请求出错了!' + error.message)
        })

    })

    //     // 判断type类型是GET类型或者POST类型
    //     if (type === 'GET') {
    //         // type为GET时,发起axios.get请求
    //         return axios.get(url, { // 配置对象
    //             params: data // 指定请求参数
    //         })
    //     } else {
    //         // 否则发起post 请求
    //         return axios.post(url, data)
    //     }
}

// 在package.json中添加配置
// "proxy":"URL"