import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { pushCommentAction, changeCommentAction } from '../Redux/actions.js'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
class RootComment extends Component {

    constructor(props) {
        super(props);
        var defaultState = {
            comment: {
                content: ""
            }
        }
        this.state = defaultState
    }

    onTextChange = (e) => {  
        var comment = this.state.comment
        comment.content = e.target.value
        this.setState({ comment })
    }

    render() {
        var pid = this.props.pid
        const { innerblog, pushComment, user } = this.props
        const handlePushComment = (value, pid) => {
            var _blog = _.cloneDeep(innerblog)
            var _date = (new Date).toLocaleDateString();
            var comm = {}
            comm.date = _date
            comm.content = value
            if(user.username == ""){
                alert('请先登录')
                return false
            }
            comm.auther = user.username
            _blog.comment.push(comm) 
            pushComment(_blog)
            this.setState({
                comment: {
                    content: ""
                }
            })
        }

        return (
            <div className="comment" data-index={pid}>  
                {innerblog!=undefined? innerblog.comment.map((Comm,index)=>
                  <div key={index} className="comm">
                    <p>{Comm.content}</p>
                    <small>{Comm.auther} {Comm.date}</small>
                  </div>
                ):""}
                <div className="comm-input">
                  <input 
                    type="text" 
                    placeholder="再次输入评论" 
                    onChange={this.onTextChange.bind(this)} 
                    value={this.state.comment.content}
                  />
                  <span 
                    className="btn btn-default" 
                    onClick={ handlePushComment.bind(this, this.state.comment.content , pid) }
                  >立即评论</span>
                </div>
            </div>
        )
    }
}
 

function mapStateToProps(state) {
    // 这里拿到的state就是store里面给的state
    return {
        user: state.user,
        innerblog: state.innerblog
    }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    return {
        pushComment: bindActionCreators(pushCommentAction, dispatch)
    }
}


let Comment = connect(
    mapStateToProps,
    mapDispatchToProps
)(RootComment)

export { RootComment }
export default Comment;
