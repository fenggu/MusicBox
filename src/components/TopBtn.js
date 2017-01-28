import React, { Component } from 'react';
import { Link ,browserHistory } from 'react-router'; 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'  
import { Menu, Dropdown, Icon } from 'antd';
import { autoLoginAction, loginAction ,autoLoginAjax} from '../Redux/actions.js'
class RootTopBtn extends Component {
    constructor(props) {
        super(props); 
    } 

    componentWillMount() {
      var { autoLogin, handleajax } = this.props
      autoLogin()
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
                <span className="tb-active">我的</span>
                <span>音乐馆</span>
              </div>
              <div>
                <span> 
                  <Dropdown overlay={menu}>
                    <i className="iconfont icon-gengduo"></i> 
                  </Dropdown>   
                </span>
              </div> 
            </header>
        )
    }
}

function mapStateToProps(state) { 
    return { 
      user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({  
      autoLogin: autoLoginAction,
      handleajax: autoLoginAjax
    }, dispatch)
}

let TopBtn = connect(
    mapStateToProps,
    mapDispatchToProps
)(RootTopBtn);
export { RootTopBtn }
export default  TopBtn