import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'; 
import { getlistAction } from '../Redux/actions.js'
import { bindActionCreators } from 'redux'
import { getsonglistActionClick, getallsongActionClick, gethistoryAction, getnextsongAction, addlikelistActionClick, getlikesActionClick, addsongsAction } from '../Redux/actions'
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
        if (this.state.id == "likes" || this.state.id == "all" || this.state.id == "history") return ""
        if (user.songlist == undefined) return "iconfont icon-weibiaoti1"
        if (user.songlist.indexOf(id) > -1) {
            return "iconfont icon-aixin"
        } else {
            return "iconfont icon-weibiaoti1"
        }
    }

    componentWillMount() { 
        const { getlist, getsongs, getlikes, gethistory, history } = this.props
        var id = this.state.id
        if (id == "likes") {
            getlikes()
            return 
        }
        if (id == 'history') {
            var localhistory = JSON.parse(localStorage.history)
            gethistory(localhistory)
            return
        } 
        if(id == 'all') {
            getsongs()
            return
        }
        getlist(id)  

    }

    render() {    
        var { songlist, songs, changesong, addlike, addsongs } = this.props
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
                <SongList songlist={list} addsongs={addsongs} songs={songs} changesong={changesong}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    // 这里拿到的state就是store里面给的state
    return {  
        user: state.user,
        songlist: state.songlist,
        songs: state.songs,
        history: state.history
    }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {   
    return bindActionCreators({   
        changesong: getnextsongAction,
        gethistory: gethistoryAction,

        getlist: getsonglistActionClick,
        addlike: addlikelistActionClick,
        addsongs: addsongsAction,
        getlikes: getlikesActionClick,
        getsongs: getallsongActionClick
    }, dispatch)
}

let List = connect(
    mapStateToProps,
    mapDispatchToProps
)(RootList)
export { RootList }
export default List;