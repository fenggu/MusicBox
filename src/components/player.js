import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'; 
import { Progress } from 'antd'
import { getnextsongAction, addlikesongActionClick, addsongsAction } from '../Redux/actions.js'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
class RootPlayer extends Component {
    constructor(props) {
        super(props);
        this.bindFunc() 
        var defaultState = {
            progress: 0, 
            type: 0,
            audio: {
                dom:{},
                currentTime: 0,
                duration: 0
            },
            index: 0,
            oId: ""
        }
        this.state = defaultState
    } 

    componentWillMount() { 
        let { song, songs, getnextsongAction } = this.props  
        var index = this.state.index 
        var _song = songs.list[index]   
        getnextsongAction(_song) 
    } 

    componentWillUpdate() {
        let { song } = this.props
        let { audio, oId, progress } = this.state

        if (!song) return false 
        if (oId == "" || song._id != oId) {
            oId = song._id  
            audio.currentTime = 0 
            audio.dom.currentTime = 0
            audio.dom.autoplay = true  
            this.setState({  
                audio, 
                oId,
                progress: 0,
            })
        }
    }

    componentDidMount() {
        var audio = this.refs.audio
        var audiostate = this.state.audio;
        audiostate.dom = audio  
        this.setState({audio: audiostate})

    }

    bindFunc() {
        this.bindFuncNames = ['getTime', 'onPlay', 'getProgress', 'toLittle', 'audioSeek', 'next', 'changePlay']
        this.bindFuncs = {}
        this.bindFuncNames.forEach( funcName => {
          this.bindFuncs[funcName] = this[funcName].bind(this)
        })
    }

    audioSeek(e){ //跳转
        var audio = this.state.audio
        var length = e.pageX - e.target.offsetLeft; 
        var percent = length / e.target.offsetWidth; 
        var currentTime = percent * audio.duration;
        audio.currentTime = currentTime
        audio.dom.currentTime = currentTime
        this.setState(audio)
    }

    next = value => {
        var { songs, getnextsongAction, addsongs} = this.props
        var { index, audio, type } = this.state 
        audio.currentTime = 0 
        audio.dom.currentTime = 0
        audio.dom.autoplay = true

        if (type == 0) { //顺序播放
            if (value == -1 && index == 0) {
                return false;
            }
            if ( value == 1 &&index == songs.list.length-1 ) { 
                index = -1 
            }
            index = index + value   
        }

        if (type == 1){ //随机播放  
            index = this.getRandomIndex(index, songs.list.length) 
        }

        if (type == 2) { 
            this.setState({  
                audio, 
                progress: 0
            })
        }
        var song = songs.list[index] 
        getnextsongAction(song)


        //存储缓存逻辑
        this.setlocalStorage(song)

        this.setState({ 
            index, 
            audio, 
            progress: 0
        })
    }
    getRandomIndex = (i, n) => {
        let index = Math.floor(Math.random() * n )
        if (index == i) { 
            return this.getRandomIndex(index, n)
        } else {   
            return index
        }
    }
    setlocalStorage(song) {
        var { songs } = this.props
        var Ids = []
        var Hids = []
        var locallist = JSON.parse(localStorage.songs)
        var localhistory = JSON.parse(localStorage.history)
        locallist.list.map( s => {
            Ids.push(s._id)
        })  
        if (Ids.indexOf(song._id) <= -1) {
            songs.list.push(song)
            addsongs(songs)
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
            var str = JSON.stringify(localhistory); 
            localStorage.history = str 
        } else {
            localhistory.list.splice(h, 1)
            localhistory.list.unshift(song)
            localhistory.title = "播放历史"
            localhistory.pic = 'http://localhost:8081/public/mdl.png'
            var str = JSON.stringify(localhistory); 
            localStorage.history = str 
        } 
    }
    onPlay(){ //播放
        var audio = this.state.audio; 
        if (audio.dom.paused) { 
            audio.dom.play()
        } else {
            audio.dom.pause()
        }
        this.setState({audio}) 
    }
 
    getTime(data) { //获取时间
        data = Math.floor(data) * 1000
        data = new Date(data); 
        var min = data.getMinutes()
        var sec = data.getSeconds()
        sec > 10 ? sec : sec = '0' + sec 
        var time = min + '：' + sec
        return time
    }

    getProgress(e) {  //控制进度条
        var progress = this.state.progress
        var audio = this.state.audio 
        audio.currentTime = e.target.currentTime
        audio.duration = e.target.duration
        var progress = e.target.currentTime / e.target.duration

        if (progress == 1) {
            this.next (1)
        }
        progress = progress * 50 +'%'; 
        this.setState({progress, audio}) 
    }

    isLikeSong(id) {
        var { user } = this.props
        if (user.likes == undefined) return "iconfont icon-weibiaoti1"
        if (user.likes.indexOf(id) > -1) {
            return "iconfont icon-aixin"
        } else {
            return "iconfont icon-weibiaoti1"
        }
    }

    toLittle(content) { //缩短字体
        var newcontent = ""
        if (content == undefined) return
        if (content.length > 15) {
            newcontent = content.slice(0, 15) + "..."
        } else {
            newcontent = content;
        } 
        return newcontent
    }

    changePlay () {
        var type = this.state.type
        type = type + 1
        type == 3 ? type = 0: ""
        this.setState({type})
    }
    /* render */
    getMenu () {
        var type = this.state.type
        if (type == 0) {
            return (  <i className="iconfont icon-shunxubofang"></i> )
        }
        if(type == 1) {
            return ( <i className="iconfont icon-suiji2"></i> )
        }
        if(type == 2) {
            return (<i className="iconfont icon-ttpodicon"></i>)
        }
    }
     render() {    
        let { audio } = this.state 
        let { song, addlikesong } = this.props 
        var paused = audio.dom.paused
        return ( 
            <div className="player"> 
                <div className="player-pic"  onClick={this.bindFuncs.onPlay.bind(this)} >
                    <img src={ song == undefined? 'http://localhost:8081/public/default.jpg': song.pic } alt=""/>
                </div>
                <div className="player-btn">
                    <i className="iconfont icon-xiayishou1" onClick={this.bindFuncs.next.bind(this,-1)}></i>
                    <i className={!paused ? "iconfont icon-bofang1 hidden": "iconfont icon-bofang1"} onClick={this.bindFuncs.onPlay.bind(this)}></i>
                    <i className={paused ? "iconfont icon-iconfont67 hidden": "iconfont icon-iconfont67"}  onClick={this.bindFuncs.onPlay.bind(this)}></i> 
                    <i className="iconfont icon-xiayishou" onClick={this.bindFuncs.next.bind(this,1)}></i>
                </div>
                <div className="player-type" onClick={this.bindFuncs.changePlay.bind(this)}>
                    {this.getMenu()}
                </div>
                <p>{song ? this.bindFuncs.toLittle(song.title): ""}
                    <i className={this.isLikeSong(song ? song._id: "")} onClick={addlikesong.bind(this, song? song._id : "")}></i> 
                </p>  
                <div className="ant-progress-line">
                    <div style={{width: this.state.progress}}  onClick={this.bindFuncs.audioSeek.bind(this)}  className="progress-active"></div>
                    <div onClick={this.bindFuncs.audioSeek.bind(this)} className="progress-background"></div>
                </div>
                <span className="time"> 
                    <span>{this.bindFuncs.getTime(audio.currentTime)}/</span>
                    <span>{this.bindFuncs.getTime(audio.duration)}</span>
                </span>
                <audio id="audio" onTimeUpdate={this.bindFuncs.getProgress.bind(this)} ref="audio" src={song? song.url:""}></audio>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {  
        user: state.user,
        songs: state.songs,//列表
        song: state.song
    }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {  
    
    return bindActionCreators({
        getnextsongAction: getnextsongAction,
        addlikesong: addlikesongActionClick,
        addsongs: addsongsAction
    }, dispatch) 
}

let Player = connect(
    mapStateToProps,
    mapDispatchToProps
)(RootPlayer)
export { RootPlayer }
export default Player;