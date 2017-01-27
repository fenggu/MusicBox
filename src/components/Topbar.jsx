import React, { Component } from 'react';
import { Link ,browserHistory } from 'react-router'; 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'  
class RootTopBar extends Component {
    constructor(props) {
        super(props); 
    } 
    back () {
      window.history.go(-1)
    }
    render() { 
        return ( 
            <header className="top-bar">    
              <i className="iconfont icon-iconfontarrleft" onClick={this.back.bind(this)}></i>
              {this.props.title}
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

let TopBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(RootTopBar);
export { RootTopBar }
export default  TopBar