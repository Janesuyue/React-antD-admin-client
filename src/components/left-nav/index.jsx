import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd';

import './index.less'
import logo from '../../assets/image/logo.png'
import menuList from '../../config/menuconfig'

const { SubMenu } = Menu;

class LeftNav extends Component {

    /**
     * 根据menu的数据数组生成对应的标签数组
     * 使用map() + 递归
     */
    getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }

    /**
     * 根据menu的数据数组生成对应的标签数组
     * 使用reduce() + 递归
     */
    getMenuNodes = (menuList) => {
        // 得到当前请求的路由路径
        const path = this.props.location.pathname

        return menuList.reduce((pre, item) => {
            if (!item.children) {
                // 向pre添加<Menu.Item>
                pre.push((
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            } else {

                // 查找一个与当前请求路径匹配的子Item
                const cIten = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                // 如果存在，说明当前item的子列表需要展开
                if (cIten) {
                    this.openKey = item.key
                }

                // 向pre添加<SubMenu>
                pre.push((
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                ))
            }

            return pre
        }, [])
    }

    /**
     * 在第一次render()之前执行一次
     * 为第一个render()渲染做准备数据(必须是同步)
     */
    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
        // debugger
        // debugger 页面调试

        // 得到当前请求的路由路径
        let path = this.props.location.pathname

        if (path.indexOf('/product') === 0) { // 当前请求的是商品或其子路由界面
            path = '/product'
        }

        // 得到需要打开的openKey
        const openKey = this.openKey

        return (
            <div className="left_nav">
                <Link to="/" className="left_nav_header">
                    <img src={logo} alt="logo" />
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    // defaultSelectedKeys={[path]}
                    /**
                     * defaultSelectidKeys于selectedKeys 的作用类似，selectedKeys是动态的
                     * 这里我们用selectedKeys做选项被选中，通过子选项的key,决定选中的哪一个页面
                     */
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                >
                    {/* <Menu.Item key="/home">
                        <Link to="/home">
                            <Icon type="pie-chart" />
                            <span>首页</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                <Icon type="mail" />
                                <span>商品</span>
                            </span>
                        }
                    >
                        <Menu.Item key="/product">
                            <Link to="/product">
                                <Icon type="pie-chart" />
                                <span>品类管理</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/category">
                            <Link to="/category">
                                <Icon type="pie-chart" />
                                <span>商品管理</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu> */}
                    {
                        // this.getMenuNodes(menuList)
                        this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}

/**
 * withRouter高阶组件:
 * 包装非路由组件，放回一个新的组件
 * 新的组件向非路由组件传递3个属性:history/location/match
 */

export default withRouter(LeftNav)