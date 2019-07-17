import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd'

import menuList from '../../config/menuconfig'
import { formateDate } from '../../utils/dateUtils'
import { reqWeather } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../link-button'
import './index.less'

class Header extends Component {

    state = {
        currentTime: formateDate(Date.now()), // 当前时间字符串
        dayPictureUrl: '', //天气图片
        weather: '', // 天气文本
    }

    getTime = () => {
        // 每隔1s获取当前时间，并更新状态数据currentTime
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({ currentTime })
        }, 1000)
    }

    getWeather = async () => {
        // 调用接口请求异步获取数据
        const { dayPictureUrl, weather } = await reqWeather('郑州')
        // 更新状态
        this.setState({ dayPictureUrl, weather })
    }

    getTitle = () => {
        // 得到当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) { // 如果当前item对象的key与path一样，item的title就是需要显示的title
                title = item.title
            } else if (item.children) {
                // 在所有子item中查找匹配的
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                // 如果有值才说明有匹配的，并取出他的title
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }

    logout = () => {
        Modal.confirm({
            content: '是否确认退出登录?',
            onOk: () => {
                // console.log('OK');
                // 删除保存的数据
                storageUtils.removeUser()
                memoryUtils.user = {}

                // 跳转到登录
                this.props.history.replace('/login')
            }
        })
    }

    /**
     * 第一次render() 之后执行一次
     * 一般在此执行异步操作:发起ajax请求，定时器
     */
    componentDidMount() {
        // 获取当前时间
        this.getTime()
        // 获取当前天气
        this.getWeather()
    }

    /*
    // 不能这么做:不会更新显示
    componentWillMount(){
        this.title = this.getTitle()
    }
     */

    /**
     * 当前组件卸载之前调用
     */
    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.intervalId)
    }

    render() {
        const { currentTime, dayPictureUrl, weather } = this.state

        const username = memoryUtils.user.username

        // 得到根据当前路径需要显示的title
        const title = this.getTitle()

        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        {title}
                    </div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="天气图标" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)