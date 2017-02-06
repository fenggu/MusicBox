import React, { Component } from 'react';
import { connect } from 'react-redux'; 
import { getlistAction } from '../Redux/actions.js'
import { bindActionCreators } from 'redux'
class SongList extends Component {
    constructor(props) {
        super(props);
    } 

    toLittle(content) { //缩短字体
        var newcontent = ""
        if (content == undefined) return
        if (content.length > 20) {
            newcontent = content.slice(0, 20) + "..."
        } else {
            newcontent = content;
        } 
        return newcontent
    }

    componentWillMount() { 
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
            console.log(songs)
            songs.list.push(song)
            addsongs(songs)
            var str = JSON.stringify(songs); 
            localStorage.songs = str
        }



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

    render() {   
        const { songlist } = this.props
        return ( 
            <div className="song-list">
                {
                    songlist.map((song, index) =>   
                        <div key={index} onClick={ this.onChangeSong.bind(this, song) }> 
                            <p> <small>{index + 1}</small>{this.toLittle(song.title)} <span>{song.author}</span></p>
                        </div> 
                    )
                }
            </div>
        )
    }
}

// function mapStateToProps(state) {
//     // 这里拿到的state就是store里面给的state
//     return { 
//         songlist: state.songlist
//     }
// }

// // Map Redux actions to component props
// function mapDispatchToProps(dispatch) {
//     return { 
//     }
// }

// let SongList = connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(RootSongList)
// export { RootSongList }
export default SongList;
