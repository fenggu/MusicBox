import React, { Component } from 'react';
import { Router, Route, browserHistory, Link ,IndexRoute, Redirect} from 'react-router';
import { Home, List, DeskTop, About, Login, Sign, MusicBox, Admin } from './index.js' 
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
  },
  history: {
    title:"播放历史",
    list: [],
    pic: 'http://localhost:8081/public/mdl.png'
  }
}    
if (!localStorage.songs) {
  localStorage.songs = JSON.stringify(initState.songs)
} else {
  console.log(JSON.parse(localStorage.songs))
  initState.songs = JSON.parse(localStorage.songs)
}

if (!localStorage.history) {
  localStorage.history = JSON.stringify(initState.history)
} else {
  initState.history = JSON.parse(localStorage.history)
}

const logger = createLogger() 
const createStoreWithMiddleware = applyMiddleware(
  thunk, 
  // logger
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
                <Route path="/list/:id" component={ List }> 
                  <Redirect form="/list/list/:id" to="/list/:id"/>
                </Route>  
                <Route path="/login" component={ Login }/>  
                <Route path="/sign" component={ Sign }/>   
                <Route path="/about" component={ About }/>   
              </Route> 
              <Route path="/admin" component={ Admin }>
                
              </Route>
            </Router>  
          </div>
        </Provider> 
    );
  }
}
export default App