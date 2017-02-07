import React, { Component } from 'react'; 
import { MineBtn, TopBar } from '../components' 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'  
import { LogoutAction, getallsongActionClick } from '../Redux/actions'
import { Menu, Dropdown, Icon, Input } from 'antd'; 
const Search = Input.Search;

class About extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    render() { 
        return ( 
          <div> 
            <TopBar title="关于"></TopBar>
            一个弱鸡的自我反省中
          </div>
      )
    }
}
 
export default  About 
