import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'; 
import { getlistAction } from '../Redux/actions.js'
import { bindActionCreators } from 'redux'
import { getsonglistAction, getsonglistActionClick, getallsongActionClick, gethistoryAction, getnextsongAction, addlikelistActionClick, getlikesActionClick, addsongsAction } from '../Redux/actions'
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
        if (this.state.id == "likes" || this.state.id == "all" || this.state.id == "history" || this.state.id == 'songs') return ""
        if (user.songlist == undefined) return "iconfont icon-weibiaoti1"
        if (user.songlist.indexOf(id) > -1) {
            return "iconfont icon-aixin"
        } else {
            return "iconfont icon-weibiaoti1"
        }
    }

    componentWillMount() { 
        const { getlist, getthissongs, song, getsongs, getlikes, gethistory, history, songs } = this.props
        var id = this.state.id
        console.log(this.props)
        if (id == "likes") {
            getlikes()
            return 
        }
        if (id == 'history') {
            var localhistory = JSON.parse(localStorage.history)
            gethistory(localhistory)
            return
        } 
        if (id == 'all') {
            getsongs()
            return
        }
        if (id == 'songs') {
            songs.title = '正在播放' 
            console.log(song)
            if (song.pic) {
                songs.pic = song.pic 
            } else {
                songs.pic = 'http://localhost:8081/public/default.jpg'
            }
            getthissongs(songs)
            return
        }
        if (id.indexOf('search') > -1) {
            var n = id.indexOf('search')
            var value = id.slice(6)
            getsongs(value) 
            return 
        }
        getlist(id)  

    }

    render() {    
        var { songlist, songs, changesong, addlike, addsongs } = this.props
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
        song: state.song,
        history: state.history
    }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {   
    return bindActionCreators({   
        changesong: getnextsongAction,
        gethistory: gethistoryAction,
        getthissongs: getsonglistAction,
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
