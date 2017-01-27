import React, { Component } from 'react';
import { connect } from 'react-redux';
import { markdown } from 'markdown'
import { delblogAction, addblogAction } from '../Redux/actions.js'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

class RootAddNewBlog extends Component {
    constructor(props) {
        super(props);
        var defaultState = {
            blog: { 
                auther:"",
                title: "",
                content: "",
                date: "",
                comment: [{
                    content: "",
                    date: ""
                }],
                pid: ""
            }
        }
        var pid = this.props.params.pid
        if (pid) {
            defaultState.blog = _.cloneDeep(this.props.innerblog)
        }
        this.state = defaultState
    }

    handleDelBlog(pid) {
        const { handledelblogAction } = this.props
        if (pid == "") {
            alert('您尚未保存')
            return false
        }
        handledelblogAction(pid)
    }

    onTextChange(blogKey) {
        return e => {
            var blog = this.state.blog
            blog[blogKey] = e.target.value
            this.setState({ blog })
        }
    }
    handleAddBlog(lastpid) {
        const { handleaddblogAction, user } = this.props
        var blog = this.state.blog
        var _date = new Date;
        blog.date = _date.toLocaleDateString();
        blog.auther = user.username
        if (blog.pid == "") {
            blog.pid = parseInt(lastpid) + 1;
        }
        handleaddblogAction(blog)
    }

    render() {
        const { lastpid } = this.props
        var { blog } = this.state
        return (
            <div>   
              <form className="BlogPage">
                <span 
                  onClick={this.handleAddBlog.bind(this, lastpid)}  
                  className="btn btn-default"
                >保存
                </span>

                <span 
                  onClick={this.handleDelBlog.bind(this, blog.pid)}  
                  className="btn btn-default"
                >删除
                </span>

                <div className="form-group"> 
                  <label htmlFor="blogtitle">标题</label> 
                  <input 
                    type="text" 
                    id="blogtitle" 
                    className="BlogInput 
                    form-control" 
                    value={blog.title}  
                    onChange={this.onTextChange('title').bind(this)}
                  />
                </div> 
                <div className="form-group">
                  <label htmlFor="blogtitle">内容</label><br />
                  <div 
                    name="" 
                    id="blogcontent" 
                    className="BlogInput form-control" 
                    dangerouslySetInnerHTML = {{__html:markdown.toHTML(blog.content)}}  
                  >
                  </div>
                  <textarea 
                    name="" 
                    id="blogcontent" 
                    className="BlogInput form-control" 
                    value={blog.content} 
                    onChange={this.onTextChange('content').bind(this)}
                  >
                  </textarea>
                </div>
              </form>
            </div>
      )
    }
}

function mapStateToProps(state) {
    // 这里拿到的state就是store里面给的state
    return {
        user:state.user,
        innerblog: state.innerblog,
        lastpid: state.bloglist.lastpid
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        handleaddblogAction: addblogAction,
        handledelblogAction: delblogAction
    }, dispatch)
}

let AddNewBlog = connect(
    mapStateToProps,
    mapDispatchToProps
)(RootAddNewBlog)
export { RootAddNewBlog }
export default AddNewBlog;
