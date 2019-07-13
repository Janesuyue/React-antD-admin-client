import React, { Component } from 'react'
import { Row, Col, Form, Icon, Input, Button, message } from 'antd'
import { Redirect } from 'react-router-dom'

import './login.less'
import logo from '../../assets/image/logo.png'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtile from '../../utils/storageUtils'



/**
 * 登录路由组件
 * 1,前台表单验证
 * 2,收集表单输入数据
 * 1)登录后，刷新后依然是已登录状态(维持登录)
 * 2)登录后，关闭浏览器后打开浏览器依然是登录状态(自动登录)
 * 3)登录后，访问登录路径自动跳转到管理界面
 */
class LoginForm extends Component {

    handleSubmit = e => {
        // 阻止事件的默认行为
        e.preventDefault();

        // 根据props中form对象的validateFields属性通过标识,获取输入的值
        // 对所有表单字段进行检验
        this.props.form.validateFields(async (err, values) => {
            // 检验成功
            if (!err) {
                const { userName, password } = values
                // reqLogin(userName, password).then(response => {
                //     console.log('成功了', response.data)
                // }).catch(error => {
                //     console.log('失败了', error)
                // })

                // try {
                //     const response = await reqLogin(userName, password)
                //     console.log('请求成功', response)
                // } catch (error) {
                //     console.log('请求出错了!', error)
                // }

                // 错误提示优化,错误提示统一管理
                const response = await reqLogin(userName, password)
                // console.log('请求成功', response)
                const result = response.data
                console.log(result)
                memoryUtils.user = result // 保存到内存中
                storageUtile.saveUser(result) // 保存到local中
                if(result.code === 'success'){
                    message.success('登录成功')
                    // 跳转到管理页面,replace方法(不需要回退到登录页)
                    this.props.history.replace('/')
                }else{
                    message.error(result.message)
                }

            } else {
                // console.log("检验失败")
            }
        });
        
        // // 得到form对象
        // const form = this.props.form
        // // 获取表单项的输入数据
        // const values = form.getFieldsValue()
        // console.log('handleSubmit()',values)
    };

    /**
     * 对密码进行自定义验证
     */
    validatorPwd = (rule, value, callback) => {
        // console.log('validatorPwd',rule,value)
        // callback() // 验证成功
        // callback('xxx') // 验证失败,并指定提示的文本
        if (!value) {
            callback('密码不能为空')
        } else if (value.length < 4) {
            callback('密码长度不能小于4位')
        } else if (value.length > 12) {
            callback('密码长度不能大于12位')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('密码必须是英文,数字或下划线组成')
        } else {
            callback()
        }
    }

    render() {
        // 如果用户已经登录，自动跳转到管理界面
        const user = memoryUtils.user
        if(user && user.token){
            return <Redirect to='/'/>
        }

        // 获取具有强大属性的form对象
        const form = this.props.form
        const { getFieldDecorator } = form;

        return (
            <div className="login">
                <Row type="flex" align="middle" className="login_header">
                    <img src={logo} alt="logo" />
                    <h1>顾家后台管理</h1>
                </Row>
                <Row type="flex" align="middle" justify="end" className="login_content">
                    <Col span={5} className="login_form" pull={2}>
                        <Col span={24} className="login_title">
                            登录
                        </Col>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                {/* getFieldDecorator('标识',{校验})(渲染组件) */}
                                {getFieldDecorator('userName', {
                                    // 配置对象:属性名是特定的一些名称
                                    // /^[a-zA-Z0-9]+$/ 匹配英文数字或者下划线,加号代表多个
                                    // 声明式验证:直接使用别人定义好的验证规则进行验证
                                    rules: [
                                        { required: true, whitespace: true, message: '用户名必须输入' },
                                        { min: 4, message: '用户名至少四位' },
                                        { max: 12, message: '用户名最多十二位' },
                                        { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文,数字或者下划线' },
                                    ],
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Username"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [
                                        { validator: this.validatorPwd }
                                    ],
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="Password"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button" block>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}
const Login = Form.create({ name: 'normal_login' })(LoginForm);
export default Login