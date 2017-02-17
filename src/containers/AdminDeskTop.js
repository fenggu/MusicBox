import React, { Component, Children } from 'react';
import { TopBar, Player } from '../components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'  
import { Menu, Dropdown, Icon } from 'antd';
import { autoLoginAction, loginAction ,autoLoginAjax} from '../Redux/actions.js'

import { browserHistory } from 'react-router'
class RootDeskTop extends Component {
    constructor(props) {
        super(props);
    } 

    componentWillMount() {
      var { autoLogin } = this.props 
      autoLogin()
    }

    render() {  

      var pathname = this.props.location.pathname
      return (
          <div> 
            { this.props.children }  
          </div>
      );
    }
}


function mapStateToProps(state) { 
    return { 
      user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({  
      autoLogin: autoLoginAction
    }, dispatch)
}

let DeskTop = connect(
    mapStateToProps,
    mapDispatchToProps
)(RootDeskTop);
export { RootDeskTop }
export default  DeskTop 