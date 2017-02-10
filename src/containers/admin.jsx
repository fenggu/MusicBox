import React, { Component } from 'react'; 
import { AdminForm, SearchInput } from '../components' 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'  
import { 
  delSongToListAction, 
  addsongActionClick, 
  addSongToListAction,  
  delallsongActionClick, 
  getmusiclistActionClick, 
  getsonglistActionClick, 
  getallsongActionClick,  
  addsonglistActionClick, 
  addsongsAction,
  delsonglistActionClick
} from '../Redux/actions'
import { Menu, Dropdown, Select, Icon, Input, Table, Button } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const Option = Select.Option;

let timeout;

class RootAdmin extends Component {
  constructor(props) {
    super(props);

    var defaultState = {
      isEdit: false, 
      isList: false,
      data: [],
      value: ''
    }
    this.state = defaultState
  }

  componentWillMount() {
    this.props.getmusiclist()
    this.props.getsongs()
    this.getOptions()
  }  

  handleClick = e => {
    let { getlist, getsongs } = this.props
    if (e.key == "allsongs") {
      getsongs()
      this.setState({isList: false})
      return
    }
    this.setState({isEdit: false})
    this.setState({isList: true,  songlistId: e.key})
    getlist(e.key) 
  }
  onNew = e => {
    const { addsongtolist, getlist } = this.props
    var isEdit = this.state.isEdit
    var isList = this.state.isList
    if (isList) {
      console.log(this.state)
      var value = this.state.value 
      var songlistId = this.state.songlistId
      addsongtolist(value, songlistId)
      // getlist(songlistId) 
      return 
    }
    this.setState({isEdit: !isEdit})
  }
  onDelsonglist = e => {
    const { delsonglist } = this.props
    var isList = this.state.isList 
    if(isList) {
      var songlistId = this.state.songlistId 
      delsonglist(songlistId)
    }
  }

  setOptions = data => {
    this.setState({data: data})
  }

  onChangeSelect() { 
    return e => { 
      this.setState({value: e})
    }
  }

  getOptions() {
    var callback = this.setOptions
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    let self = this    
    fetch('/v1/songtitles', {
        method: 'post',
        credentials: 'include', //配置cookie来获取session
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function(response) {
        return response.json()
    }).then(function(json) {
        if (!json.success) {
          alert(json.error)
        } else { 
          return self.setState({data: json.data.list})
          console.log(json.data)
        }
    }).catch(function(err) {
        console.log(err)
    })  
  } 
  


  renderMenu() {
    var { musiclist } = this.props
    return (
      <Menu onClick={this.handleClick}
        style={{ width: 240 }}
        defaultOpenKeys={['sub1']} 
        mode="inline"
      >

      <Menu.Item key="allsongs">歌曲</Menu.Item> 
      <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>歌单</span></span>}>
        {
          musiclist.list.map( (s, index) => {
            return (  
              <Menu.Item key={s._id}>{s.title}</Menu.Item>
              )
          })
        }
      </SubMenu> 
    </Menu>
    );

  }

  getSearchInput() {
    const options = this.state.data.map(d => <Option value={d._id} key={d._id}>{d.title}</Option>);
    return (
        <Select className={this.state.isList? "": "hidden"}   value={this.state.value} onChange={this.onChangeSelect().bind(this)}>
          {options}
        </Select>

      ) 
  }
  render() {
    var {isList, songlistId} = this.state
    var { musiclist, songlist, addsonglist, delsong, getlist, delsongtolist, uploadsong } = this.props 
    function deletesong(songId) {
      if (isList) {
        delsongtolist(songId, songlistId)
        // getlist(songlistId) 
      } else {
        delsong(songId)
      }
    }
    const columns = [{
      title: '歌曲名称',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: '缩略图',
      dataIndex: 'pic',
      key: 'pic',
      render: pic => <img src={pic} alt=""/>,
    }, {
      title: '作者',
      dataIndex: 'author',
      key: 'author', 
    }, {
      title: 'Action',
      key: 'key',
      render: (key, record) => ( 
        <span onClick={deletesong.bind(this, record.key)}>  
            <a> 删除 </a>
        </span>
      ),
    }];
    songlist.list.map( l => {
      l.key = l._id
    })
    return (
      <div> 
        <div className="admin-menu">
          {this.renderMenu()}
        </div>
        <div className="admin-table">  
          {
            // this.getSearchInput()
          }
          <SearchInput getkey={true} handleSelect={this.onChangeSelect().bind(this)} placeholder="搜索歌曲"/>

          <Button onClick={this.onNew.bind(this)}>{this.state.isEdit? "返回": "新增"}</Button> 
          <Button className={this.state.isList? "": "hidden"} onClick={this.onDelsonglist.bind(this)}>删除</Button> 
          <Table pagination={false} className={this.state.isEdit?"hidden":''} columns={columns} dataSource={songlist.list} />
          <div className="admin-form" className={this.state.isEdit?"":'hidden'}>
            <AdminForm isList={this.state.isList} addsonglist={addsonglist} uploadsong={uploadsong}/>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) { 
  return { 
    user: state.user, 
    songlist: state.songlist,
    musiclist: state.musiclist
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({   
    getmusiclist: getmusiclistActionClick,
    addsongtolist: addSongToListAction,
    delsongtolist: delSongToListAction,
    getlist: getsonglistActionClick, 
    addsongs: addsongsAction, 
    getsongs: getallsongActionClick,
    delsong: delallsongActionClick,
    uploadsong: addsongActionClick,
    addsonglist: addsonglistActionClick,
    delsonglist: delsonglistActionClick
  }, dispatch)
}

let Admin = connect(
  mapStateToProps,
  mapDispatchToProps
)(RootAdmin);
export { RootAdmin }
export default  Admin 
