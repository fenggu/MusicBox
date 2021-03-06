import { browserHistory } from 'react-router'
import { message } from 'antd';
import fetch from 'isomorphic-fetch'
/*
 * action actionType类型
 */
export const next = 'next'; //下一首

/******* ajax ********/
export const adduser = 'adduser'; //注册
export const login = 'login'; //登录
export const getsongs = 'getsongs'; //获取当前播放列表
export const gethistory = 'gethistory'; //获取最近播放
export const getlikes = 'getlikes'; //获取收藏
export const like = 'like'; //添加收藏
export const likelist = 'likelist'; //添加收藏
export const getsonglist = 'getsonglist'; //获取歌单
export const getplaylist = 'getplaylist'; //获取歌单列表 楼上父级
export const getmusiclist = 'getmusiclist'; //获取音乐馆列表
export const searchmusic = 'searchmusic'; //搜索音乐
export const searchmusicname = 'searchmusicname'; //搜索框提示名字
export const addsongs = 'addsongs'; //添加song到localstorge
export const getallsongs = 'getallsongs';
export const uploadsong = 'uploadsong'; //添加song到localstorge
/*
 * action actionCreator 创建函数
 */
export function gethistoryAction(list) {
    return { type: gethistory, list: list}
}

export function getnextsongAction(song) {
    return { type: next, song: song }
}

export function getuser(user) {
    return { type: login, user: user }
}

export function adduserAction(user) { //注册
    return dispatch => {
        return fetch('/v1/user/sign', {
            method: 'post',
            credentials: 'include', //配置cookie来获取session
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: user.username,
                password: user.password,
                passwordConfirm: user.passwordConfirm
            })
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            if (!json.success) {
                message.error(json.error)
            } else {
                //dispatch(getuser(json.data))
                browserHistory.push("/login")
            }
        }).catch(function(err) {
            console.log(err)
        });
    }
}

export function loginAction(user) { //登录
    return dispatch => {
        return fetch('/v1/user/login', {
            method: 'post',
            credentials: 'include', //配置cookie来获取session
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: user.username,
                password: user.password
            })
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            if (!json.success) {
                message.error(json.error)
            } else {
                dispatch(getuser(json.data))
                // browserHistory.push("/")
            }
        }).catch(function(err) {
            console.log(err)
        });
    }
}

export function autoLoginAction() { //自动登录
    return dispatch => {
        return fetch('/v1/user/autologin', {
            credentials: 'include', //配置cookie来获取session
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            if (json.success == false) {
                message.error(json.error)
            } else {
                dispatch(getuser(json.data))
            }
        }).catch(function(err) {
            console.log(err)
        });
    }
}

export function LogoutAction() { //退出登录
    return dispatch => {
        return fetch('/v1/user/logout', {
            credentials: 'include', //配置cookie来获取session
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            if (json.success == false) {
                message.error(json.error)
            } else {
                dispatch(getuser(json.data))
                window.location.reload();
            }
        }).catch(function(err) {
            console.log(err)
        });
    }
}

function getmusiclistAction(list) {
    return { type: getmusiclist, list: list }
}
export function getmusiclistActionClick() {
    return dispatch => {
        return fetch('/v1/musiclists', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            if (!json.success) {
                message.error(json.error)
            } else {
                dispatch(getmusiclistAction(json.data))
            }
        }).catch(function(err) {
            console.log(err)
        })
    }
}

export function getsonglistAction(list) {
    return { type: getsonglist, list: list }
}

export function getsonglistActionClick (id) {
    return dispatch => {
        return fetch('/v1/songlist/' + id, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            if (!json.success) {
                message.error(json.error)
            } else {
                dispatch(getsonglistAction(json.data))
            }
        }).catch(function(err) {
            console.log(err)
        })
    }
}


export function getallsongActionClick (name) {
    return dispatch => {
        return fetch('/v1/songs?name=' + name, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            if (!json.success) {
                message.error(json.error)
            } else {
                dispatch(getsonglistAction(json.data))
            }
        }).catch(function(err) {
            console.log(err)
        })
    }
}

export function delallsongActionClick (id) {
    return dispatch => {
        return fetch('/v1/songs/' + id, {
            method: 'delete',

            credentials: 'include', //配置cookie来获取session
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            if (!json.success) {
                message.error(json.error)
            } else {
                dispatch(getallsongActionClick())
                message.success('删除成功');
            }
        }).catch(function(err) {
            console.log(err)
        })
    }
}

export function addsongActionClick (song) {
    return dispatch => {
        return fetch('/v1/songs/', {
            method: 'post',
            credentials: 'include', //配置cookie来获取session
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: song.title,
                url: song.url,
                author: song.author,
                pic: song.pic,
                lrc: song.lrc,
                username: song.username
            })
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            if (!json.success) {
                message.error(json.error)
            } else {
                message.success('上传成功！ ')
                dispatch(getallsongActionClick())
            }
        }).catch(function(err) {
            console.log(err)
        })
    }
}

export function addsonglistActionClick (song) {
    return dispatch => {
        return fetch('/v1/songlist/', {
            method: 'post',
            credentials: 'include', //配置cookie来获取session
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: song.title,
                pic: song.pic,
                type: song.type
            })
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            if (!json.success) {
                message.error(json.error)
            } else {
                message.success('添加成功！ ')
                dispatch(getmusiclistActionClick())
            }
        }).catch(function(err) {
            console.log(err)
        })
    }
}

export function delsonglistActionClick (songlistId) {
    return dispatch => {
        return fetch('/v1/songlist/', {
            method: 'delete',
            credentials: 'include', //配置cookie来获取session
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                songlistId: songlistId
            })
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            if (!json.success) {
                message.error(json.error)
            } else {
                dispatch(getmusiclistActionClick())
                var data = {
                    list: []
                }
                dispatch(getsonglistAction(data))
                message.success('删除成功');
            }
        }).catch(function(err) {
            console.log(err)
        })
    }
}

export function addlikesongActionClick(id) { //添加收藏
    return dispatch => {
        return fetch('/v1/user/likesong', {
            method: 'post',
            credentials: 'include', //配置cookie来获取session
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                songId: id
            })
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            if (!json.success) {
                message.error(json.error)
            } else {
                dispatch(getuser(json.data))
            }
        }).catch(function(err) {
            console.log(err)
        });
    }
}

export function addlikelistActionClick(id) { //添加收藏
    return dispatch => {
        return fetch('/v1/user/likelist', {
            method: 'post',
            credentials: 'include', //配置cookie来获取session
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                songlistId: id
            })
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            if (!json.success) {
                message.error(json.error)
            } else {
                dispatch(getuser(json.data))
            }
        }).catch(function(err) {
            console.log(err)
        });
    }
}

export function getplaylistAction(list){
    return { type: getplaylist, list: list}
}

export function getplaylistActionClick() {
    return dispatch => {
        return fetch('/v1/user/likelist', {
            method: 'get',
            credentials: 'include', //配置cookie来获取session
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            if (!json.success) {
                console.log(json.error)
            } else {
                dispatch(getplaylistAction(json.data))
            }
        }).catch(function(err) {
            console.log(err)
        });
    }
}


function getlikesAction(list) {
    return { type: getsonglist, list: list }
}

export function getlikesActionClick (id) {
    return dispatch => {
        return fetch('/v1/user/likesong', {
            method: 'get',
            credentials: 'include', //配置cookie来获取session
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            if (!json.success) {
                message.error(json.error)
                browserHistory.push('/')
            } else {
                dispatch(getsonglistAction(json.data))
            }
        }).catch(function(err) {
            message.error(err)
        })
    }
}

export function addsongsAction(songs) {
    return { type: addsongs, songs: songs}
}


export function addSongToListAction (songId, songlistId) {
    return dispatch => {
        return fetch('/v1/editsonglist', {
            method: 'post',
            credentials: 'include', //配置cookie来获取session
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                songId: songId,
                songlistId: songlistId
            })
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            if (!json.success) {
                message.error(json.error);
            } else {
                dispatch(getsonglistActionClick(songlistId))
                message.success('添加成功');
            }
        }).catch(function(err) {
            console.log(err)
        })
    }
}
export function delSongToListAction (songId, songlistId) {
    return dispatch => {
        return fetch('/v1/editsonglist', {
            method: 'delete',
            credentials: 'include', //配置cookie来获取session
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                songId: songId,
                songlistId: songlistId
            })
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            if (!json.success) {
                message.error(json.error);

            } else {
                dispatch(getsonglistActionClick(songlistId))
                message.success('删除成功');

            }
        }).catch(function(err) {
            console.log(err)
        })
    }
}