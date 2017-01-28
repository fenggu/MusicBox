import { browserHistory } from 'react-router'
import fetch from 'isomorphic-fetch'
import $ from 'jquery'
/*
 * action 类型
 */
export const adduser = 'adduser'; //注册
export const login = 'login'; //登录 
export const next = 'next'; //下一首
/*
 * action 创建函数
 */

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
            console.log(json)
            if (!json.success) {
                alert(json.error)
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
                alert(json.error)
            } else {
                dispatch(getuser(json.data))
                browserHistory.push("/")
                console.log(json.data)
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
                console.log(json.error)
            } else {
                dispatch(getuser(json.data))
                browserHistory.push("/")
                console.log(json.data)
            }
        }).catch(function(err) {
            console.log(err)
        });
    }
}
