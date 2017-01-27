import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'; 
import { getlistAction } from '../Redux/actions.js'
import { bindActionCreators } from 'redux'
import { SongList, TopBar } from '../components'
class RootList extends Component {

    defaultState = {
        title: "defaultName"
    }
    constructor(props) {
        super(props);
        this.state = this.defaultState
    } 

    toLittle(content) { //缩短字体
        var newcontent = ""
        if (content == undefined) return
        if (content.length > 200) {
            newcontent = content.slice(0, 200) + "..."
        } else {
            newcontent = content;
        } 
        return newcontent
    }

    componentWillMount() { 
    }

    render() {    
        return ( 
            <div className="list"> 
                <TopBar title="default-title" />
                <div className='list-header'>
                    <img src="http://localhost:8081/public/default.jpg" alt=""/>
                    <h1>
                        索拉鲁斯大
                        <i className="iconfont icon-weibiaoti1"></i>
                    </h1>
                </div>
                <header>  
                </header>
                <SongList />
            </div>
        )
    }
}

function mapStateToProps(state) {
    // 这里拿到的state就是store里面给的state
    return {  
    }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    return { 
    }
}

let List = connect(
    mapStateToProps,
    mapDispatchToProps
)(RootList)
export { RootList }
export default List;
