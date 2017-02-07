import React, { Component } from 'react';

import { Form, Icon, Input, Button, Upload, message, Checkbox } from 'antd';
const FormItem = Form.Item;

class RootLogin extends Component {

  constructor(props) {
    super(props);
    var defaultState = {
      url: "",
      title: "",
      author: "",
      pic: ""
    }
    this.state = defaultState
  }

  handleSubmit(state) { 
    var { uploadsong } = this.props
    this.props.form.validateFields((err, values) => {
      if (!err) {
        state.title = values.title;
        state.author = values.author
        uploadsong(state)
        console.log('Received values of form: ', state);
      }
    });
  }
  render() {
    var state = this.state
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const uploadSongprops = { 
      action: '/v1/uploadfile',
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file);
          if (!info.file.error) {
            var url = info.file.response.data.file.path.slice(6)
            state.url = url
            console.log(state) 
          } 
        }
      },
      defaultFileList: [],
    };
    const uploadPicprops = { 
      action: '/v1/uploadfile',
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file);
          if (!info.file.error) {
            var pic = info.file.response.data.file.path.slice(6)
            state.pic = pic
            console.log(pic) 
          } 
        }
      },
      defaultFileList: [],
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit.bind(this, state)} className="admin-form">
        <FormItem 
          {...formItemLayout}>
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input addonBefore={<Icon type="caret-right" />} placeholder="title" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}>
          {getFieldDecorator('author', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input addonBefore={<Icon type="user" />} placeholder="author" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="上传音乐"
          extra="上传音乐"
        >
          <Upload {...uploadSongprops}>
            <Button>
              <Icon type="upload" /> Upload
            </Button>
          </Upload>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="上传缩略图"
          extra="上传缩略图"
        >
          <Upload {...uploadPicprops}>
            <Button>
              <Icon type="upload" /> Upload
            </Button>
          </Upload>
        </FormItem>

        <FormItem> 
          <Button type="primary" htmlType="submit" className="login-form-button">
            提交
          </Button>
        </FormItem>
      </Form>
    );
  }
}

let AdminForm = Form.create()(RootLogin)
export default AdminForm