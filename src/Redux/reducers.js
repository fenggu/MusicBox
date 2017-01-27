import { combineReducers } from 'redux'
import * as actions from './actions'
import { browserHistory } from 'react-router'
// Reducer 
function Reducer(state, action) { 
    switch (action.type) { 

        case actions.login:
            return Object.assign({}, state, { user: action.user})
        
        case actions.next:
        	console.log(action.song)
        	return Object.assign({}, state, { song: action.song })

        default:
            return state
    }
}
export default Reducer
