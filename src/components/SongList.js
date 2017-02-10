import React, { Component } from 'react';
import { connect } from 'react-redux'; 
import { getlistAction } from '../Redux/actions.js'
import { bindActionCreators } from 'redux'
class SongList extends Component {
    constructor(props) {
        super(props);
    } 

    toLittle(content, num) { //缩短字体
        var newcontent = ""
        if (content == undefined) return
        if (content.length > num) {
            newcontent = content.slice(0, num) + "..."
        } else {
            newcontent = content;
        } 
        return newcontent
    }

    componentWillMount() { 
    } 

    render() {   
        const { songlist, changesong } = this.props

        return ( 
            <div className="song-list">
                {
                    songlist.map((song, index) =>   
                        <div key={index} onClick={ this.props.onChangeSong.bind(this, song) }> 
                            <p> <small>{index + 1}</small>{this.toLittle(song.title, 17)} <span>{this.toLittle(song.author, 5)}</span></p>
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
