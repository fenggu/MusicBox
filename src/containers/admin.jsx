import React, { Component } from 'react'; 
import { AdminForm } from '../components' 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'  
import { addsongActionClick, delallsongActionClick, getmusiclistActionClick, getsonglistActionClick, getallsongActionClick, gethistoryAction, getnextsongAction, addlikelistActionClick, getlikesActionClick, addsongsAction } from '../Redux/actions'
import { Menu, Dropdown, Icon, Input, Table, Button } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const Search = Input.Search;


class RootAdmin extends Component {
  constructor(props) {
    super(props);

    var defaultState = {
      isEdit: false
    }
    this.state = defaultState
  }

  componentWillMount() {
    this.props.getmusiclist()
    this.props.getsongs()
  }  

  handleClick = e => {
    let { getlist, getsongs } = this.props
    if (e.key == "allsongs") {
      getsongs()
      return
    }

    getlist(e.key) 
  }
  onNew = e => {
    var isEdit = this.state.isEdit
    this.setState({isEdit: !isEdit})
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
      <SubMenu key="sub4" title={<span><Icon type="setting" /><span>用户</span></span>}>
        <Menu.Item key="9">登录</Menu.Item>
        <Menu.Item key="10">关于</Menu.Item> 
      </SubMenu>
    </Menu>
    );

  }

  render() {

    var { musiclist, songlist, delsong, uploadsong } = this.props 
    const columns = [{
      title: '歌曲名称',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: 'url',
      dataIndex: 'url',
      key: 'url',
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
        <span onClick={delsong.bind(this, record.key)}>  
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
          <Button onClick={this.onNew.bind(this)}>新增</Button>
          <Table className={this.state.isEdit?"hidden":''} columns={columns} dataSource={songlist.list} />
          <div className="admin-form" className={this.state.isEdit?"":'hidden'}>
            <AdminForm uploadsong={uploadsong}/>
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
    changesong: getnextsongAction,
    gethistory: gethistoryAction,

    getlist: getsonglistActionClick,
    addlike: addlikelistActionClick,
    addsongs: addsongsAction,
    getlikes: getlikesActionClick,
    getsongs: getallsongActionClick,
    delsong: delallsongActionClick,
    uploadsong: addsongActionClick
  }, dispatch)
}

let Admin = connect(
  mapStateToProps,
  mapDispatchToProps
)(RootAdmin);
export { RootAdmin }
export default  Admin 
