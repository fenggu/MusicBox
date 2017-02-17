import React, { Component } from 'react';

import { Form, Icon, Select, Input, Button, Upload, message, Checkbox } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class RootLogin extends Component {

  constructor(props) {
    super(props);
    var defaultState = {
      url: "",
      title: "",
      author: "",
      pic: "",
      lrc: "",
      isList: 'song'
    }
    this.state = defaultState
  }

  handleSubmit(state) { 
    var { uploadsong, addsonglist, user } = this.props
    var isList = this.state.isList
    this.props.form.validateFields((err, values) => {
      if (!err) {
        state.title = values.title;
        state.author = values.author

        if (isList == 'list') {
          state.url = ""
          state.lrc = "" 
          state.type = values.type
          state.username = user.username
          addsonglist(state)
        } 

        if (isList == 'song') { 
          state.username = user.username
          uploadsong(state) 
        }
        console.log('Received values of form: ', state);
      }
    });
  }

  onChangeSelect() { 
    return e => {  
      this.setState({isList: e})
    }
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
          } 
        }
      },
      defaultFileList: [],
    };


    const uploadLrcprops = { 
      action: '/v1/uploadfile',
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file);
          if (!info.file.error) {
            var lrc = info.file.response.data.file.path.slice(6)
            state.lrc = lrc
          } 
        }
      },
      defaultFileList: [],
    };

    const uploadPicprops = { 
      action: '/v1/uploadfile',
      onChange(info) {
        if (info.file.status !== 'uploading') { 
          if (!info.file.error) {
            var pic = info.file.response.data.file.path.slice(6)
            state.pic = pic 
          } 
        }
      },
      defaultFileList: [],
    };
    const { getFieldDecorator } = this.props.form;  
    var onChangeSelect = this.onChangeSelect().bind(this)
    return (
      <div>
        <Select value={state.isList} style={{marginTop: 20, marginBottom: 20}} onChange={onChangeSelect}>
          <Option value='song'>歌曲</Option>
          <Option value='list'>歌单</Option>
        </Select>

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

            className={state.isList=="list"? "hidden":""}
            {...formItemLayout}>
            {getFieldDecorator('author', { 
            })(
              <Input addonBefore={<Icon type="user" />} placeholder="author" />
            )}
          </FormItem>
          

          <FormItem
            className={state.isList=="list"? "":"hidden"}
            {...formItemLayout}>
            {getFieldDecorator('type', {
              rules: [{ required: true, message: 'Please choose your type!' }],
            })(
              <Select style={{ width: 120 }}>
                <Option value="acg">ACG</Option>
                <Option value="classic">古典</Option>
                <Option value="absolute">纯音乐</Option>
                <Option initialValue="popular" value="popular">流行音乐</Option>
              </Select>
            )}
          </FormItem>


          <FormItem
            {...formItemLayout}
            label="上传音乐"
            extra="上传音乐"  
            className={state.isList=="list"? "hidden":""}
          >
            <Upload {...uploadSongprops}>
              <Button>
                <Icon type="upload" /> Upload
              </Button>
            </Upload>
          </FormItem>


          <FormItem
            {...formItemLayout}
            label="上传歌词"
            extra="上传歌词"  
            className={state.isList=="list"? "hidden":""}
          >
            <Upload {...uploadLrcprops}>
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
      </div>
    );
  }
}

let AdminForm = Form.create()(RootLogin)
export default AdminForm