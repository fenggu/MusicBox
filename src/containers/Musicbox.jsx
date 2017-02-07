import React, { Component } from 'react'; 
import { MineBtn, TopBtn, PlayList } from '../components'
import { Input } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'   
import { Link } from 'react-router'; 
import { Menu, Dropdown, Icon } from 'antd'; 
import { getmusiclistActionClick } from '../Redux/actions'
const Search = Input.Search;

class RootMusicBox extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
      const { getmusiclist } = this.props
      getmusiclist() 

    }
    
    render() {
        const { user, musiclist } = this.props
        console.log(musiclist)
        return ( 
          <div>
            <TopBtn user = {user}/> 
            <div className="music-list">  
              {
                musiclist.list.map( (s, index) => {
                  return ( 
                    <Link to={"/list/" + s._id}  key={s._id}>
                      <div className="list-child" >
                        <img src={s.pic} alt=""/>
                        <h3>{s.title}</h3>
                      </div>
                    </Link> 
                    )
                })
              }
            </div>
          </div>
      )
    }
}

function mapStateToProps(state) { 
    return { 
      user: state.user,
      musiclist: state.musiclist
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({   
      getmusiclist: getmusiclistActionClick
    }, dispatch)
}

let MusicBox = connect(
    mapStateToProps,
    mapDispatchToProps
)(RootMusicBox);
export { RootMusicBox }
export default  MusicBox 
