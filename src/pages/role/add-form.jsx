import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input
} from 'antd'

const Item = Form.Item

/**
 * 添加分类的from组件
 */
class AddForm extends Component {
    static propType = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form

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
            <Form >
                <Item label="角色管理" {...formItemLayout}>
                    {
                        getFieldDecorator('roleName', {
                            initialValue: '',
                            rules: [
                                { required: true, message: '角色名称必须输入' }
                            ]
                        })(
                            <Input placeholder="请输入角色名称" />
                        )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)