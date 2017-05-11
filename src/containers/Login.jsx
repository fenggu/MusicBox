import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

import { loginAction } from '../Redux/actions.js'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { TopBar } from '../components'

import { Form, Icon, Input, Button, Checkbox } from 'antd';

const FormItem = Form.Item;

class RootLogin extends Component {
    constructor(props) {
        super(props);
        var defaultState = {
            user: {
                username: "",
                password: ""
            }
        }
        this.state = defaultState
    }
 

    handleSubmit = e => {
        e.preventDefault();
        const { handleLogin } = this.props
        const { getFieldsValue, validateFields } = this.props.form;
        var user = getFieldsValue()
        user.password = user.password.trim()
        user.password = CryptoJS.SHA256(user.password).toString()
        validateFields((errors) => {
          if (errors) {
            return false
          }
          handleLogin(user)
        }) 
    }

    componentWillReceiveProps(nextProps) { 
      if (nextProps.user.loggedIn) {
        browserHistory.push('/')
      }
    }

    render() {   

        const { getFieldProps, getFieldDecorator } = this.props.form;
        var { user } = this.state   

        return ( 
            <Form onSubmit={this.handleSubmit} className="login-form login-form-m ">
              <TopBar title="登录"></TopBar>
              <FormItem>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: 'Please input your username!' }],
                })(
                  <Input addonBefore={<Icon type="user" />} placeholder="Username" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                  <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
                )}
              </FormItem>
              <FormItem> 
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Log in
                </Button>
                Or <Link to="/sign">现在注册!</Link>
              </FormItem>
            </Form>
            );
    }
}; 

function mapStateToProps(state) {
    // 这里拿到的state就是store里面给的state
    return {
      user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        handleLogin: loginAction
    }, dispatch)
}
let LoginForm = Form.create()(RootLogin)
let Login = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm);
 export { RootLogin }
export default  Login
