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

        function filtersix (element, index, array) {
          return true
        }

        function filterAcg (element, index, array) {
          return (element.type == 'acg')
        }

        function filterPop (element, index, array) {
          return (element.type == 'popular')
        }

        function filterClass (element, index, array) {
          return (element.type == 'classic')
        }

        function filterAbs (element, index, array) {
          return (element.type == 'absolute')
        }

        const { user, musiclist } = this.props
        console.log(musiclist)
        return (
          <div>
            <TopBtn user = {user}/>
            <div className="music-list">
              <div>
                  <h3 className="list-title">
                    <span>新单速递</span>
                  </h3>
                  {
                    musiclist.list.filter(filtersix).map( (s, index) => {
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

              <div>
                  <h3 className="list-title">
                    <span>ACG</span>
                  </h3>
                  {
                    musiclist.list.filter(filterAcg).filter(filtersix).map( (s, index) => {
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


              <div>
                  <h3 className="list-title">
                    <span>流行音乐</span>
                  </h3>
                  {
                    musiclist.list.filter(filterPop).filter(filtersix).map( (s, index) => {
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


              <div>
                  <h3 className="list-title">
                    <span>纯音乐</span>
                  </h3>
                  {
                    musiclist.list.filter(filterAbs).filter(filtersix).map( (s, index) => {
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

              <div>
                  <h3 className="list-title">
                    <span>古典乐</span>
                  </h3>
                  {
                    musiclist.list.filter(filterClass).filter(filtersix).map( (s, index) => {
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
