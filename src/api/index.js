/**
 * 要求:能根据接口文档定义接口请求
 * 包含应用中所有接口请求函数的模块
 * 每个函数的返回值的是promise
 * 基本要求：能根据接口文档定义接口请求函数
 */
import jsonp from 'jsonp'
import ajax from './Ajax'
import { message } from 'antd';

const BASE = ''

//  登录
// export function reqLogin(username, password) {
//     return ajax('./login',{username,password},'POST')
// }
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')

//获取一级/二级分类列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', { parentId })

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', { categoryName, parentId }, 'POST')

// 更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')

// 获取商品分类列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', { pageNum, pageSize })

// // 搜索商品分页列表 (根据商品名称)
// export const reqSearchProducts = (pageNum, pageSize, searchName) => ajax(BASE + '/manage/product/search', {
//     pageNum,
//     pageSize,
//     productName: searchName
// })

// // 搜索商品分页列表 (根据商品描述)
// export const reqSearchProducts = (pageNum, pageSize, searchName) => ajax(BASE + '/manage/product/search', {
//     pageNum,
//     pageSize,
//     productDesc: searchName
// })

/**
 * 搜索商品分页列表 (根据商品名称/商品描述)
 * searchType:(搜索的类型)  productName / productDesc
 * 如果想让一个变量的值作为属性名的时候，需要加上中括号
 */
export const reqSearchProducts = (pageNum, pageSize, searchName, searchType) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName
})

// 根据分类ID获取分类名称
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', { categoryId })

// 对商品进行上架/下架处理
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')

// 图片删除
export const reqDeleteImg = (roleName) => ajax(BASE + '/manage/img/delete', { roleName }, 'POST')

// // 添加商品
// export const reqAddProduct = (product) => ajax(BASE + '/manage/product/add', product, 'POST')

// // 修改商品
// export const reqUpdateProduct = (product) => ajax(BASE + '/manage/product/update', product, 'POST')

// 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')

// 添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', { roleName }, 'POST')

// 更新角色(设置角色权限)
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')

// 获取所有用户的列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')

// 删除指定的用户
export const reqDeletelUser = (userId) => ajax(BASE + '/manage/user/delete', { userId }, 'POST')

// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

/**
 * jsonp请求的接口请求函数
 */
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(url, {}, (err, data) => {
            // console.log('jsonp()', err, data)
            // 如果成功
            if (!err && data.status === 'success') {
                // 取出需要的数据
                const { dayPictureUrl, weather } = data.results[0].weather_data[0]
                resolve({ dayPictureUrl, weather })
            } else {
                // 如果失败
                message.error('获取天气信息失败！')
            }
        })
    })

}
// reqWeather('北京')
/**
 * **jsonp解决ajax跨域的原理
1)jsonp只能解决GET类型的ajax请求跨域问题
2)jsonp请求不是ajax请求，而是一般的get请求
3)基本原理
	浏览器端:
		动态生成<sctipt>来请求后台接口(src就是接口的url)
		定义好用于接收响应数据的函数(fn)，并将函数名通过请求参数提交给后台(如:callback=fn)
	服务器端:
		接收到请求处理产生结果数据后，返回一个函数调用的JS代码，并将结果数据作为实参传入函数调用
	浏览器端:
		收到响应自动执行函数调用的JS代码，也就执行了提前定义好的回调函数，并得到了需要的结果数据
 */