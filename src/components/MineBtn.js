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
                    <i>icon</i>
                    <p>All</p>
                </div>
                <div>
                    <Link to="/list/likes">
                        <i>icon</i>
                        <p>MyLike</p>
                    </Link>
                </div>
                <div>
                    <i>icon</i>
                    <p>nearly</p>
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