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
    likes: [], //我喜欢
    history: [], //最近播放
    songlist: [] //我的歌单
  }, 
  songlist: {
    list: []
  },

  playlist: [ //歌单列表
  ],
  song: {

  },
  songs: {
    list: [ //当前播放的列表 计划前端使用localstorges 存储到cookie
      ]
  },
  musiclist: {
    list: []
  }
}    
if (!localStorage.songs) {
  localStorage.songs = JSON.stringify(initState.songs)
} else {
  initState.songs = JSON.parse(localStorage.songs)
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