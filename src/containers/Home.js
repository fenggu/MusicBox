import React, { Component } from 'react'; 
import { MineBtn, TopBtn, PlayList } from '../components' 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'  
import { Menu, Dropdown, Icon, Input } from 'antd'; 
const Search = Input.Search;

class RootHome extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    render() {
        const { user } = this.props
        return ( 
          <div>
            <TopBtn user = {user}/>
            <div className="input-search">
              <Search />
            </div>
          	<MineBtn />
            <div> 
              <h3 className="list-title">
                <span>我的歌单</span>
              </h3>
              <PlayList />
            </div>
          </div>
      )
    }
}

function mapStateToProps(state) { 
    return { 
      user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({   
    }, dispatch)
}

let Home = connect(
    mapStateToProps,
    mapDispatchToProps
)(RootHome);
export { RootHome }
export default  Home 
