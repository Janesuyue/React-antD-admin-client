import React, { Component } from 'react'
import {
    Card,
    Icon,
    List
} from 'antd'

const Item = List.Item

/**
 * Product的详情子路由组件
 */
export default class ProductDetail extends Component {
    render() {
        const title = (
            <span>
                <Icon type='arrow-left' />
                商品详情
            </span>
        )
        return (
            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <span className="left">商品名称:</span>
                        <span>联想ThinkPad 翼4809</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述:</span>
                        <span>年度重量级新品，X390、T490全新登场 更加轻薄机身设计9</span>
                    </Item>
                    <Item>
                        <span className="left">商品价格:</span>
                        <span>65999</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类:</span>
                        <span>电脑 ---> 笔记本</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片:</span>
                        <span>
                            <img
                                className="product-img"
                                src="https://img14.360buyimg.com/n1/s450x450_jfs/t1/28779/38/10926/201019/5c8a2900E631566f0/fac1038641ffd945.jpg"
                                alt="img"
                            />
                            <img
                                className="product-img"
                                src="https://img14.360buyimg.com/n1/s450x450_jfs/t1/28779/38/10926/201019/5c8a2900E631566f0/fac1038641ffd945.jpg"
                                alt="img"
                            />
                        </span>
                    </Item>
                    <Item>
                        <span className="left">商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html:'<h1 style="color: red">商品详情</h1>'}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
