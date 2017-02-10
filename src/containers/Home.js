import React, { Component } from 'react'; 
import { MineBtn, TopBtn, PlayList, SearchInput } from '../components' 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'  
import { Link ,browserHistory } from 'react-router'; 
import { LogoutAction, getallsongActionClick } from '../Redux/actions'
import { Menu, Dropdown, Icon, Input } from 'antd'; 
const Search = Input.Search;

class RootHome extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    render() {
        const { user, logout, getsongs } = this.props

        function handleSelect(value) { 
          browserHistory.push('/list/search'+ value )
        }
        return ( 
          <div>
            <TopBtn logout={logout} user={user}/> 
            <div style={{'textAlign': 'center'}}>
              <SearchInput getkey={false}  handleSelect={handleSelect} placeholder="搜索歌曲"/>
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
      logout: LogoutAction
    }, dispatch)
}

let Home = connect(
    mapStateToProps,
    mapDispatchToProps
)(RootHome);
export { RootHome }
export default  Home 
