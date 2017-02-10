import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'; 
import { getlistAction } from '../Redux/actions.js'
import { bindActionCreators } from 'redux'
import { getsonglistAction, getsonglistActionClick, getallsongActionClick, gethistoryAction, getnextsongAction, addlikelistActionClick, getlikesActionClick, addsongsAction } from '../Redux/actions'
import { SongList, TopBar } from '../components'
class RootList extends Component {

    defaultState = {
        title: "defaultName",
        paused: true
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

    isLikeList(id) {
        var { user } = this.props
        if (this.props.params.id == "likes" || this.state.id == "all" || this.state.id == "history" || this.state.id == 'songs') return ""
        if (user.songlist == undefined) return "iconfont icon-weibiaoti1"
        if (user.songlist.indexOf(id) > -1) {
            return "iconfont icon-aixin"
        } else {
            return "iconfont icon-weibiaoti1"
        }
    }

    onChangeSong(song) {
        var { changesong, songs, addsongs } = this.props
        var Ids = []
        var Hids = []
        var locallist = JSON.parse(localStorage.songs)
        var localhistory = JSON.parse(localStorage.history)

        locallist.list.map( s => {
            Ids.push(s._id)
        })


        if (Ids.indexOf(song._id) <= -1) {
            songs.list.push(song)
            addsongs(songs) //分发到 store
            var str = JSON.stringify(songs); 
            localStorage.songs = str 
        }
        localhistory.list.map( s => {
            Hids.push(s._id)
        })
        var h = Hids.indexOf(song._id) 
        if (h <= -1) {
            localhistory.list.unshift(song)
            localhistory.title = "播放历史"
            localhistory.pic = 'http://localhost:8081/public/mdl.png'
            var str = JSON.stringify(localhistory)
            localStorage.history = str
        } else {
            localhistory.list.splice(h, 1)
            localhistory.list.unshift(song)
            localhistory.title = "播放历史"
            localhistory.pic = 'http://localhost:8081/public/mdl.png'
            var str = JSON.stringify(localhistory)
            localStorage.history = str
        }
        changesong(song)
    }

    playlist(){ 
        var { songlist } = this.props
        var list = songlist.list
        for (var i = list.length-1; i > -1; i--) {
            this.onChangeSong(list[i])
        } 
    }

    componentWillMount() { 
        const { getlist, getthissongs, song, getsongs, getlikes, gethistory, history, songs } = this.props
        var params = this.props.params
        var id = params.id  
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
        var { paused } = this.state
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
                    <h2 className="play-all">
                        播放全部
                        <i className="iconfont icon-bofang1" onClick={this.playlist.bind(this)}></i>
                    </h2>
                </div>
                <header>  
                </header>
                <SongList songlist={list} addsongs={addsongs} songs={songs} onChangeSong={this.onChangeSong} changesong={changesong}/>
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
