import React, { Component } from 'react';
import { Link ,browserHistory } from 'react-router'; 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'  
import { Menu, Dropdown, Icon } from 'antd';
import { autoLoginAction, loginAction ,autoLoginAjax} from '../Redux/actions.js'
class TopBtn extends Component {
    constructor(props) {
        super(props); 
    } 
 
    render() { 
        let { user } = this.props
        const menu = (
          <Menu>
            <Menu.Item>
              { user.loggedIn ?  <Link to="/login">退出登录</Link> : <Link to="/login">登录</Link>     
              }
            </Menu.Item>
            <Menu.Item>
              <Link to="/about">关于</Link>
            </Menu.Item>
          </Menu>
        );
        return ( 
            <header className="top-btn">    
              <div>
                <img src="" alt=""/>
              </div>
              <div>
                <span><Link to="/">我的</Link> </span>
                <span><Link to="/musicbox">音乐馆</Link></span>
                
              </div>
              <div> 
                <span>
                  <Dropdown overlay={menu} trigger={['click']}>
                      <a className="ant-dropdown-link" href="#">
                        更多 <Icon type="down" />
                      </a> 
                   </Dropdown>
                  
                </span>
              </div> 
            </header>
        )
    }
}
 
export default  TopBtn