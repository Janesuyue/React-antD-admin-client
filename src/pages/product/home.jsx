import React, { Component } from 'react'
import { Card, Select, Table, Input, Button, Icon } from 'antd'

import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts } from '../../api'
import { PAGE_SIZE } from '../../utils/constants';

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
                dataIndex: 'status',
                render: (status) => {
                    return (
                        <span>
                            <Button type="primary">下架</Button>
                            <span>在售</span>
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
                            <LinkButton>详情</LinkButton>
                            <LinkButton>修改</LinkButton>
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
            console.log(result)
            this.setState({
                total,
                products: list
            })
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
            <Button type='primary'>
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
