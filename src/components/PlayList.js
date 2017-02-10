import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'; 
import { getlistAction, getplaylistActionClick } from '../Redux/actions.js'
import { bindActionCreators } from 'redux'
class RootPlayList extends Component {
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
        let { getplaylist } = this.props
        getplaylist() 
    }

    render() {   
        let { playlist } = this.props;
        playlist = Array.from(playlist) 
        return ( 
            <div className="play-list">
                {
                    playlist.map((song, index) =>  
                        <Link key={index} to={ "/list/" + song._id }>
                            <div>
                                <img src={song.pic} alt={song.title}/>
                                <p>{this.toLittle(song.title, 30)}</p>
                            </div>
                        </Link>
                    )
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    // 这里拿到的state就是store里面给的state
    return { 
        playlist: state.playlist
    }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getplaylist: getplaylistActionClick
    }, dispatch) 
}

let PlayList = connect(
    mapStateToProps,
    mapDispatchToProps
)(RootPlayList)
export { RootPlayList }
export default PlayList;
