import React, { Component } from 'react';
import { Router, Route, browserHistory, Link ,IndexRoute} from 'react-router';
import { Home, List, DeskTop, Login, Sign, MusicBox } from './index.js' 
import { Provider, connect } from 'react-redux'; 
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux';
import reducer from '../Redux/reducers.js'; 
// import '../public/iconfont.css'
import './index.less';

var initState = { 
  user: {
    loggedIn: false,
    username: "", //username
    like: [], //我喜欢
    history: [], //最近播放
    songlist: [] //我的歌单
  }, 
  songlist: {
    list: []
  },

  playlist: [ //歌单列表
    {
      'title': 'song144', 
      'pic': 'http://localhost:8081/public/default.jpg', 
      'author': '123'
    },
    {
      'title': 'song133', 
      'pic': 'http://localhost:8081/public/default.jpg',
      'author': '123'
    },
  ],
  song: {

  },
  songs: { //当前播放的列表 计划前端使用localstorges 存储到cookie
    '0': {
      'title': '夢灯籠',
      'url': 'http://localhost:8081/public/RADWIMPS%20-%20%E5%A4%A2%E7%81%AF%E7%B1%A0.mp3',
      'type': 1,
      'pic':'http://localhost:8081/public/mdl.png',  
      'author': '123'
    },
    '1': {
      'title': 'Blue Star',
      'url': 'http://localhost:8081/public/%E6%A0%9E%E8%8F%9C%E6%99%BA%E4%B8%96%20-%20Blue%20Star.mp3',
      'type': 1,
      'pic':'http://localhost:8081/public/mdl.png', 
      'author': '栞菜智世'
    },
    '2': {
      'title': 'Don\'t leave me',
      'url': "http://localhost:8081/public/%E9%98%BF%E9%83%A8%E7%9C%9F%E5%A4%AE%20-%20Don\'t%20leave%20me.mp3",
      'type': 1,
      'pic':'http://localhost:8081/public/mdl.png', 
      'author': '阿部真央'
    },
    length: 3
  },
  musiclist: {
    list: []
  }
}    

const logger = createLogger()

const createStoreWithMiddleware = applyMiddleware(
  thunk, 
  logger
)(createStore);

let store = createStoreWithMiddleware(reducer,initState);

class App extends Component { 
  constructor(props) {
    super(props);
  }

  render() { 
    return (
        <Provider store={store}>
          <div>
            <Router history={ browserHistory }>
              <Route path="/" component={ DeskTop }> 
                <IndexRoute component={ Home }/>  
                <Route path="/musicbox" component={ MusicBox }/> 
                <Route path="/list/:id" component={ List }/>  
                <Route path="/login" component={ Login }/>  
                <Route path="/sign" component={ Sign }/>   
              </Route>
            </Router>  
          </div>
        </Provider> 
    );
  }
}
export default App