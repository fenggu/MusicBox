import React, { Component } from 'react';
import { Link } from 'react-router';
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

    onTextChange(key) {
        return e => {
            var user = this.state.user
            user[key] = e.target.value
            this.setState({ user })
            console.log(this.state)
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        const { handleLogin } = this.props
        var { user } = this.state 
        this.props.form.validateFields((errors) => {
          if (errors) {
            return false
          }
          handleLogin(user)
        }) 
    }
    render() {   

        const { getFieldProps, getFieldDecorator } = this.props.form;
        var { user } = this.state   

        return ( 
            <Form onSubmit={this.handleSubmit} className="login-form">
              <TopBar title="aa"></TopBar>
              <FormItem>
                {getFieldDecorator('userName', {
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
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(
                  <Checkbox>Remember me</Checkbox>
                )} <br/>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Log in
                </Button>
                Or <Link to="/sign">register now!</Link>
              </FormItem>
            </Form>
            );
    }
}; 

function mapStateToProps(state) {
    // 这里拿到的state就是store里面给的state
    return {}
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
