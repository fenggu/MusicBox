import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'; 
import { Progress } from 'antd'
import { getnextsongAction } from '../Redux/actions.js'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
class RootPlayer extends Component {
    constructor(props) {
        super(props);
        this.bindFunc() 
        var defaultState = {
            progress: 0, 
            audio: {
                dom:{},
                currentTime: 0,
                duration: 0
            },
            index: 0
        }
        this.state = defaultState
    } 

    componentWillMount() { 
        const { songs, getnextsongAction } = this.props 

        var index = this.state.index 
        var song = Array.from(songs)[index]  
        getnextsongAction(song) 
    } 

    componentDidMount() {
        var audio = this.refs.audio
        var audiostate = this.state.audio;
        audiostate.dom = audio 
        this.setState({audio: audiostate})

    }

    bindFunc() {
        this.bindFuncNames = ['getTime', 'onPlay', 'getProgress', 'toLittle', 'audioSeek', 'next']
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

    next(value){
        var { songs, getnextsongAction } = this.props
        var { index, audio } = this.state
        if (value == -1 && index == 0) {
            return false;
        }
        index = index + value   
        audio.currentTime = 0 
        audio.dom.currentTime = 0
        audio.dom.autoplay = true
        var song = songs[index] 
        getnextsongAction(song)
        this.setState({ 
            index, 
            audio, 
            progress: 0
        })
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
        progress = progress * 50 +'%'; 
        this.setState({progress, audio}) 
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

    render() {    
        let { audio } = this.state 
        let { song } = this.props
        var paused = audio.dom.paused
        return ( 
            <div className="player"> 
                <div className="player-pic"  onClick={this.bindFuncs.onPlay.bind(this)} >
                    <img src={song.pic} alt=""/>
                </div>
                <div className="player-btn">
                    <i className="iconfont icon-xiayishou1" onClick={this.bindFuncs.next.bind(this,-1)}></i>
                    <i className={!paused ? "iconfont icon-bofang1 hidden": "iconfont icon-bofang1"} onClick={this.bindFuncs.onPlay.bind(this)}></i>
                    <i className={paused ? "iconfont icon-iconfont67 hidden": "iconfont icon-iconfont67"}  onClick={this.bindFuncs.onPlay.bind(this)}></i> 
                    <i className="iconfont icon-xiayishou" onClick={this.bindFuncs.next.bind(this,1)}></i>
                </div>
                <div className="player-type">
                    <i className="iconfont icon-shunxubofang"></i>
                    <i className="iconfont icon-suiji2"></i>
                    <i className="iconfont icon-ttpodicon"></i>
                </div>
                <p>{song.title}
                    <i className="iconfont icon-weibiaoti1"></i> 
                </p>  
                <div className="ant-progress-line">
                    <div style={{width: this.state.progress}}  onClick={this.bindFuncs.audioSeek.bind(this)}  className="progress-active"></div>
                    <div onClick={this.bindFuncs.audioSeek.bind(this)} className="progress-background"></div>
                </div>
                <span className="time"> 
                    <span>{this.bindFuncs.getTime(audio.currentTime)}/</span>
                    <span>{this.bindFuncs.getTime(audio.duration)}</span>
                </span>
                <audio id="audio" onTimeUpdate={this.bindFuncs.getProgress.bind(this)} ref="audio" src={song.url}></audio>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {  
        songs: state.songs,
        song: state.song
    }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {  
    
    return bindActionCreators({
        getnextsongAction: getnextsongAction
    }, dispatch) 
}

let Player = connect(
    mapStateToProps,
    mapDispatchToProps
)(RootPlayer)
export { RootPlayer }
export default Player;
