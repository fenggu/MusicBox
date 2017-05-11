import React, { Component } from 'react';
import { Link ,browserHistory } from 'react-router'; 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'  
class RootMineBtn extends Component {
    constructor(props) {
        super(props); 
    }
    render() { 
        return ( 
            <div className="mine-btn">
                <div>
                    <Link to="/list/all"> 
                        <i className="icon-yinle iconfont"></i>
                        <p>全部音乐</p>
                    </Link>
                </div>
                <div>
                    <Link to="/list/likes">
                        <i className="iconfont icon-shoucang"></i>
                        <p>我的收藏</p>
                    </Link>
                </div>
                <div>
                    <Link to="/list/history">
                        <i className="iconfont icon-shijian"></i>
                        <p>播放历史</p>
                    </Link>
                </div>
            </div>
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

let MineBtn = connect(
    mapStateToProps,
    mapDispatchToProps
)(RootMineBtn);
export { RootMineBtn }
export default  MineBtn