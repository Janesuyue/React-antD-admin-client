import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
import './product.less'

/**
 * 商品路由
 */
export default class Product extends Component {
    render() {
        return (
            <Switch>
                {/* Switch 只匹配其中一个 */}
                <Route exact path='/product' component={ProductHome} />
                {/* exact 路径完全匹配 */}
                <Route path='/product/detail' component={ProductDetail} />
                <Route path='/product/addupdate' component={ProductAddUpdate} />
                <Redirect to='/product' />
            </Switch>
        )
    }
}
