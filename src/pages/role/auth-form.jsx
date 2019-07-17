import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Tree,
} from 'antd'
import menuList from '../../config/menuconfig.js'

const Item = Form.Item
const { TreeNode } = Tree;


/**
 * 添加分类的from组件
 */
export default class AddForm extends Component {
    static propTypes = {
        role: PropTypes.object
    }

    constructor(props) {
        super(props)

        // 根据传入角色的menus生成初始状态
        const { menus } = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    /**
     * 为父组件提交获取最新mneus数据的方法
     */
    getMenus = () => this.state.checkedKeys

    getTreeNodes(menuList) {
        return menuList.reduce((pre, item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode>
            )
            return pre
        }, [])
    }

    // 选中某个node时的回调
    onCheck = checkedKeys => {
        // console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    }

    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }

    // 根据新传入的role来更新checkedKeys状态
    /**
     * 当组件接收到新的属性是自动调用
     */
    componentWillReceiveProps(nextProps) {
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys:menus
        })

        // this.state.checkedKeys=menus
    }

    render() {
        const { role } = this.props
        const { checkedKeys } = this.state

        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { //左侧label的宽度
                span: 4
            },
            wrapperCol: { // 指定右侧包裹的宽度
                span: 20
            },
        }

        return (
            <div >
                <Item label="角色管理" {...formItemLayout}>
                    <Input value={role.name} disabled />
                </Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}
