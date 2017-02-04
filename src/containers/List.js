import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'; 
import { getlistAction } from '../Redux/actions.js'
import { bindActionCreators } from 'redux'
import { getsonglistActionClick, getnextsongAction, addlikelistActionClick, getlikesActionClick } from '../Redux/actions'
import { SongList, TopBar } from '../components'
class RootList extends Component {

    defaultState = {
        title: "defaultName"
    }
    constructor(props) {
        super(props);
        var id = this.props.params.id
        this.state = this.defaultState
        this.state.id = id
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

    isLikeList(id) {
        var { user } = this.props
        if (this.state.id == "likes") return ""
        if (user.songlist == undefined) return "iconfont icon-weibiaoti1"
        if (user.songlist.indexOf(id) > -1) {
            return "iconfont icon-aixin"
        } else {
            return "iconfont icon-weibiaoti1"
        }
    }

    componentWillMount() { 
        const { getlist, getlikes } = this.props
        var id = this.state.id
        if (id == "likes") {
            getlikes()
        } else {
            getlist(id)  
        }

    }

    render() {    
        var { songlist, changesong, addlike } = this.props
        console.log(songlist) 
        var list = songlist.list  
        return ( 
            <div className="list"> 
                <TopBar title={songlist.title} />
                <div className='list-header'>
                    <img src={songlist.pic} alt=""/>
                    <h1>
                        {songlist.title}
                        <i onClick={addlike.bind(this, songlist.id)} className={this.isLikeList(songlist.id)}></i>
                    </h1>
                </div>
                <header>  
                </header>
                <SongList songlist={list} changesong={changesong}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    // 这里拿到的state就是store里面给的state
    return {  
        user: state.user,
        songlist: state.songlist
    }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {   
    return bindActionCreators({   
        changesong: getnextsongAction,
        getlist: getsonglistActionClick,
        addlike: addlikelistActionClick,
        getlikes: getlikesActionClick
    }, dispatch)
}

let List = connect(
    mapStateToProps,
    mapDispatchToProps
)(RootList)
export { RootList }
export default List;
