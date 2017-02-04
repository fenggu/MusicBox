import { combineReducers } from 'redux'
import * as actions from './actions'
import { browserHistory } from 'react-router'
// Reducer 
function Reducer(state, action) {
    switch (action.type) {

        case actions.login:
            return Object.assign({}, state, { user: action.user })

        case actions.next:
            console.log(action.song)
            return Object.assign({}, state, { song: action.song })

        case actions.getmusiclist:
            return Object.assign({}, state, { musiclist: action.list })

        case actions.getsonglist:
            return Object.assign({}, state, { songlist: action.list })

        case actions.getplaylist:
            return Object.assign({}, state, { playlist: action.list })

        default:
            return state
    }
}
export default Reducer
