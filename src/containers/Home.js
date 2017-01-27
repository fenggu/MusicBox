import React, { Component } from 'react'; 
import { MineBtn, TopBtn, PlayList } from '../components'
import { Input } from 'antd';
const Search = Input.Search;

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return ( 
          <div>
            <TopBtn />
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

export default Home;
