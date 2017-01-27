import React, { Component } from 'react';
import { Link ,browserHistory } from 'react-router'; 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'  
import { Menu, Dropdown, Icon } from 'antd';

class RootTopBtn extends Component {
    constructor(props) {
        super(props); 
    } 

    render() { 
        const menu = (
          <Menu>
            <Menu.Item>
              <Link to="/login">登陆</Link> 
            </Menu.Item>
            <Menu.Item>
              <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">关于</a>
            </Menu.Item>
            <Menu.Item>
              <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">退出登陆</a>
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
                    <a className="ant-dropdown-link" href="#">
                      <i className="iconfont icon-gengduo"></i>
                    </a>
                  </Dropdown>
                  
                </span>
              </div> 
            </header>
        )
    }
}

function mapStateToProps(state) { 
    return { 
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({  
    }, dispatch)
}

let TopBtn = connect(
    mapStateToProps,
    mapDispatchToProps
)(RootTopBtn);
export { RootTopBtn }
export default  TopBtn