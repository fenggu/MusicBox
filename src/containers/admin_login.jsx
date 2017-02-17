import React, { Component } from 'react'; 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'  
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { Link, browserHistory } from 'react-router';
import { loginAction } from '../Redux/actions.js'  
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
      validateFields((errors) => {
        if (errors) {
          return false
        }
        handleLogin(user)
      }) 
  }

  componentWillReceiveProps(nextProps) { 
    if (nextProps.user.loggedIn) {
      browserHistory.push('/admin')
    }
  }
  
  render() { 
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} style={{maxWidth: 300, margin: '50px auto'}}  className="login-form">
        <h2>MusicBox 后台管理系统</h2>
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
        </FormItem>
      </Form>
    );
  }
}


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
 