import React, { Component } from 'react';
import { Link } from 'react-router';
import { adduserAction } from '../Redux/actions.js'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { TopBar } from '../components'

import { Form, Icon, Input, Button, Checkbox } from 'antd';

const FormItem = Form.Item;

class RootSign extends Component {
    constructor(props) {
        super(props);
        var defaultState = { 
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
        const { handleSign } = this.props
        const { getFieldsValue, validateFields } = this.props.form;
        var user = getFieldsValue()
        console.log(getFieldsValue())
        validateFields((errors) => {
          if (errors) {
            return false
          }
          handleSign(user)
        }) 
    }
    render() {   

        const { getFieldProps, getFieldDecorator } = this.props.form;
        var { user } = this.state   

        return ( 
            <Form onSubmit={this.handleSubmit} className="login-form">
              <TopBar title="注册"></TopBar>
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
                {getFieldDecorator('passwordConfirm', {
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
                Or <a>register now!</a>
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
        handleSign: adduserAction
    }, dispatch)
}
let SignForm = Form.create()(RootSign)
let Sign = connect(
    mapStateToProps,
    mapDispatchToProps
)(SignForm);
export { RootSign }
export default  Sign
