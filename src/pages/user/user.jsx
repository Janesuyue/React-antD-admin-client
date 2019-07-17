import React, { Component } from 'react'
import {
    Card,
    Table,
    Input,
    Modal,
    Button,
    message
} from 'antd'

import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constants'
import { reqUsers, reqDeletelUser, reqAddOrUpdateUser } from '../../api'
import UserForm from './user-form'

/**
 * 用户路由
 */
export default class User extends Component {
    state = {
        users: [], // 所有用户列表
        roles: [], // 所用角色列表
        isShow: false, // 是否显示确认框
    }

    /**
     * 初始化准备数据
     */
    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                // render: (role_id) => this.state.roles.find(role => role._id === role_id).name
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            },
        ]
    }

    /**
     * 根据role的数组，生成包含所有角色的对象(属性名用角色的id值)
     */
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        // 保存
        this.roleNames = roleNames
    }

    /**
     * 显示添加界面
     */
    showAdd = () => {
        this.user = null // 清除前面保存的user
        this.setState({ isShow: true })
    }

    /**
     * 显示修改页面
     */
    showUpdate = (user) => {
        this.user = user // 保存user
        this.setState({
            isShow: true
        })
    }

    /**
     * 删除指定用户
     */
    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗？`,
            content: 'Some descriptions',
            onOk: async () => {
                const result = await reqDeletelUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功')
                    this.getUsers()
                }
            }
        })
    }

    /**
     * 添加或更新
     */
    addOrUpdateUser = async () => {

        // 隐藏确认框
        this.setState({
            isShow: false
        })

        // 1).收集用户输入数据
        const user = this.form.getFieldsValue()
        this.form.resetFields()

        // 如果是更新，需要给user指定_id属性
        if (this.user) {
            user._id = this.user._id
        }

        // 2).提交添加的请求
        const result = await reqAddOrUpdateUser(user)

        // 3).更新列表显示
        if (result.status === 0) {
            message.success(`${this.user ? '修改' : '添加'}成功`)
            this.getUsers()
        }
    }

    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }

    componentDidMount() {
        this.getUsers()
    }

    componentWillMount() {
        this.initColumns()
    }

    render() {
        const { users, roles, isShow } = this.state
        const user = this.user
        const title = (
            <Button type="primary" onClick={this.showAdd}>创建用户</Button>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={{ defaultPageSize: PAGE_SIZE }}
                />
                <Modal
                    title={user ? '修改用户' : '添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.form.resetFields()
                        this.setState({ isShow: false })
                    }}
                >
                    <UserForm
                        setForm={form => this.form = form}
                        roles={roles}
                        user={user}
                    />
                </Modal>
            </Card>
        )
    }
}
