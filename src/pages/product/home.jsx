import React, { Component } from 'react'
import { Card, Select, Table, Input, Button, Icon, message } from 'antd'

import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'

const Option = Select.Option

/**
 * Product的默认子路由组件
 */
export default class ProductHome extends Component {
    state = {
        total: 0, // 商品的总数量
        products: [], // 商品的数组
        loading: false, // 是否正在加载中
        searchName: '', // 搜索的关键字
        searchType: 'productName', // 根据那个类型来搜
    }

    /**
     * 初始化Table的列的数组
     */
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price
            },
            {
                title: '状态',
                width: 100,
                // dataIndex: 'status',
                render: (product) => {
                    const { status, _id } = product
                    const newStatus = status === 1 ? 2 : 1
                    return (
                        <span>
                            <Button
                                type="primary"
                                onClick={() => this.updateStatus(_id, newStatus)}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width: 100,
                render: (product) => {
                    return (
                        <span>
                            {/* 将product对象使用state传递给目标路由组件 */}
                            <LinkButton onClick={() => this.props.history.push('/product/detail', { product })}>详情</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ];
    }

    /**
     * 获取指定页码数据的列表显示
     */
    getProducts = async (pageNum) => {
        this.pageNum = pageNum // 保存pageNum,让其他方法可以看到
        this.setState({ loading: true }) // 显示loading

        const { searchName, searchType } = this.state
        let result

        // 如果搜索关键字有值，说明我们当前是搜索分页
        if (searchName) {
            result = await reqSearchProducts(pageNum, PAGE_SIZE, searchName, searchType)
        } else { // 一般分页请求
            result = await reqProducts(pageNum, 3)
        }

        this.setState({ loading: false }) // 显示loading
        if (result.status === 0) {
            // 取出分页数据，更新状态,显示分页列表
            const { total, list } = result.data
            // console.log(result)
            this.setState({
                total,
                products: list
            })
        }
    }

    /**
     * 更新商品状态 上架/下架
     */
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }

    render() {
        // 取出状态数据
        const { products, total, loading, searchName, searchType } = this.state

        const title = (
            <span>
                <Select
                    value={searchType}
                    onChange={value => this.setState({ searchType: value })}
                >
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input
                    placeholder="关键字"
                    style={{ width: 150, margin: '0 15px' }}
                    value={searchName}
                    onChange={event => this.setState({ searchName: event.target.value })}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )

        const extra = (
            <Button
                type='primary'
                onClick={() => { this.props.history.push('/product/addupdate') }}
            >
                <Icon type="plus" />
                添加商品
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey="_id"
                    loading={loading}
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        // onChange: (pageNum) => { this.getProducts(pageNum) }  <==> onChange: this.getProducts
                        onChange: this.getProducts
                    }}
                />
            </Card>
        )
    }
}
