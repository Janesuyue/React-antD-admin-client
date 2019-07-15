import React, { Component } from 'react'
import { Card, Table, Icon, Button, message, Modal } from 'antd'

import LinkButton from '../../components/link-button'
import { reqCategorys } from '../../api'

/**
 * 商品分类路由
 */
export default class Category extends Component {
    state = {
        loading: false, // 是否正在获取数据中
        categorys: [], // 一级列表数据
        subCategorys: [], // 二级分类列表
        parentId: '0', // 当前需要显示的分类列表的父分类ID(parentId)
        parentName: '', // 当前需要显示的分类列表的父分类名称
        showStatus: 0, // 标识添加/更新的确认框是否显示，0:都不显示，1:显示添加，2:显示修改
    }

    /**
     * 初始化Table所有列的数据
     */
    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name', // 显示数据对应的属性名
            },
            {
                title: '操作',
                width: 300,
                render: (category) => ( // 返回需要显示的界面标签
                    <span>
                        <LinkButton onClick={this.showUpdate}>修改分类</LinkButton>
                        {/* 如何向事件回调函数传递参数:先定义一个匿名函数，在函数中调用处理的函数并传入数据 */}
                        {this.state.parentId === '0' ? <LinkButton onClick={() => { this.showSubCategorys(category) }}>查看子分类</LinkButton> : null}
                    </span>
                )
            }
        ]
    }

    /**
     * 异步获取一/二级列表显示
     */
    getCategorys = async () => {
        // 发请求前，显示loading
        this.setState({ loading: true })
        const { parentId } = this.state
        // 发异步ajax请求，获取数据
        const result = await reqCategorys(parentId)
        // 请求结束后，隐藏loading
        this.setState({ loading: false })
        if (result.statur === 0) {
            // 取出分类数组(可能是一级也可能是二级)
            const categorys = result.data
            if (parentId === '0') {
                // 更新一级分类数组状态
                this.setState({
                    // categorys: categorys => categorys
                    categorys
                })
            } else {
                // 更新二级分类数组状态
                this.setState({
                    subCategorys: categorys
                })
            }
        } else {
            message.error('获取分类列表失败')
        }
    }

    /**
     * 显示指定一级分类对象的二级列表数据
     */
    showSubCategorys = (category) => {
        // 更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => { // 在状态更新且重新render()后执行
            // 获取二级分类列表
            this.getCategorys()
        })
        // setState()不能立即获取最新的状态:因为setState()是异步更新状态的
    }

    /**
     * 显示指定一级分类列表
     */
    showCategorys = () => {
        // 更新为显示一级列表的状态
        this.setState({
            parentId: '0',
            parentName: '',
            showSubCategorys: []
        })
    }

    /**
     * 响应点击取消:隐藏对话框
     */
    handleCancel = () => {
        this.setState({
            showCategorys: 0
        })
    }

    /**
     * 显示添加分类的确认框
     */
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    /**
     * 添加分类
     */
    addCategory = () => {
        console.log('addCategory()')
    }

    /**
     * 显示修改分类的确认框
     */
    showUpdate = () => {
        this.setState({
            showStatus: 2
        })
    }

    /**
     * 修改分类
     */
    updateCatepory = () => {
        console.log('updateCatepory()')
    }

    /**
     * 为第一次执行render()准备数据
     */
    componentWillMount() {
        this.initColumns()
    }

    /**
     * 执行异步任务:发起异步ajax请求
     */
    componentDidMount() {
        // 获取一级分类列表
        this.getCategorys()
    }

    render() {

        // 读取状态数据
        const { categorys, parentId, parentName, subCategorys, loading, showStatus } = this.state

        // Card的左侧标题
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <i style={{ marginRight: '5px', marginLeft: '5px' }}>/</i>
                <span>{parentName}</span>
            </span>
        )

        // Card的右侧按钮
        const extra = (
            <Button type="primary" onClick={this.showAdd}>
                <Icon type="plus" />
                添加
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    columns={this.columns}
                    Pagination={{ defaultCurrent: 5, showQuickJumper: true }}
                />
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
                <Modal
                    title="修改分类"
                    visible={showStatus === 2}
                    onOk={this.updateCatepory}
                    onCancel={this.handleCancel}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
            </Card>
        )
    }
}
