var Users = db.collection('users');
var Songs = db.collection('songs');
var Songlists = db.collection('songlists');

//注册
var createUser = async(req, res) => {
    var username = req.body['username'];
    var password = req.body['password'];
    var passwordConfirm = req.body['passwordConfirm'];

    if (password !== passwordConfirm) {
        return res.json({ success: false, error: '密码不一致！' });
    }

    var data = {
        username: username,
        password: password,
        history: [],
        likes: [],
        songlist: []
    };
    try {
        var userCheck = await Users.findOne({ 'username': username })
    } catch (err) {
        return res.json({ success: false, error: err })
    }
    if (userCheck) {
        return res.json({ success: false, error: '用户已存在！' });
    }
    try {
        await Users.insert(data)
    } catch (err) {
        console.error(err)
        return res.json({ success: false, error: '创建失败：' + err })
    }
    res.json({ success: true, data: { _id: [data._id] } });
}
//登录
var login = async(req, res) => {
    var sess = req.session;
    var params = req.params || {}
    var username = req.body['username']
    var password = req.body['password']

    var user = await Users.findOne({ username: username }) 
    if (!user) {
        return res.json({ success: false, error: "账号不存在" })
    }
    if (password == user.password) {
        sess.loggedIn = true
        sess.userId = user._id
        sess.username = user.username
        sess.history = user.history
        sess.like = user.like
        sess.songlist = user.songlist
        var userRet = getSelfInfo(sess)
        console.log(userRet)
        return res.json({ success: true, data: userRet })
    } else {
        return res.json({ success: false, error: "密码错误！" })
    }
}
//登出
var logout = async(req, res) => {
    var sess = req.session;
    sess.loggedIn = false
    sess.userId = ''
    sess.username = ''
    sess.history = []
    sess.like = []
    sess.songlist = []

    var userRet = getSelfInfo(sess)
    return res.json({ success: true, data: userRet })

}
//自动登录 获取session
var getSelf = async(req, res) => {
    var sess = req.session;
    if (sess.loggedIn) {
        try {
            var user = await Users.findOne({ _id: ObjectID(sess.userId) })
            
        } catch (err) {
            // sess.loggedIn = false;
            console.log(err)
            return res.json({ success: false, error: '请重新登录' })
        }
    } else {
        return res.json({ success: false, error: '请重新登录' })
    }

    if (!user) {
        // sess.loggedIn = false
        return res.json({ success: false, error: '408请重新登录' })
    } 
    var userRet = getSelfInfo(sess)
    return res.json({ success: true, data: userRet })
}

//获取播放列表本地 ***播放列表的接口线不做了吧 改成缓存 
var getsongs = async(req, res) => {
    var sess = req.session;
    if (!sess.loggedIn) {
        return res.json({ success: false, error: '请先登录, 暂无播放列表' })
    }
}
/* 获取我的歌单列表 一个歌单一个对象
    eg: playlist : {
        songlist:[] //歌曲的id
        title: '' //歌单名称
    }
*/
var getPlaylist = async(req, res) => {
    var sess = req.session
    if (!sess.loggedIn) {
        return res.json({ success: false, error: '请先登录' })
    }
    var cond = {}
    cond['_id'] = ObjectID(sess.userId)
    try {
        var user = await Users.findOne(cond)
        var songlistIds = user.songlist
    } catch (err) {
        return res.json({ success: false, error: err })
    }
    var Ids = []
    songlistIds.map( i => {
        Ids.push(ObjectID(i))
    })
    cond['_id'] = { $in: Ids } 
    try {
        var songlists = await Songlists.find(cond).toArray() 
    } catch (err) {
        return res.json({ success: false, error: err })
    }
    if (!songlists) {
        return res.json({ success: false, error: '列表为空' })
    }

    return res.json({ success: true, data: songlists })
}

//获取收藏的单曲
var getlikes = async(req, res) => {
    var cond = {} 
    var sess = req.session
    if (!sess.loggedIn) {
        return res.json({ success: false, error: '请先登录！' })
    }

    var userId = sess.userId  
    cond._id = ObjectID(userId)
    try {
        var user = await Users.findOne(cond)
    } catch (err) {
        return res.json({success: false, error: err})
    }

    var likes = user.likes
    var Ids = []
    likes.map( i => {
        Ids.push(ObjectID(i))
    })
    cond._id = { $in: Ids}
    try {
        var list = await Songs.find(cond).toArray()
    } catch (err) {
        return res.json({ success: false, error: err})
    }
    if (!list) {
        return res.json({ success: false, data: {}, error :"列表为空，快去添加收藏吧"})
    }
    var data = {}
    data.list = list
    data.title = '我的收藏' 
    data.id = 'likes' 
    return res.json({ success: true, data: data})
}
/* 获取歌单 通过songlist的id来查找 songs并且返回
    songlist:[
        song{}
    ]
*/
var getSonglist = async(req, res) => {
    var cond = {}
    var params = req.params 

    if(params.id == "undefined") {
        return res.json({ success: false, error: '歌单请求错误！' })
    }
    cond._id = ObjectID(params.id) 
    try {
        var songlist = await Songlists.findOne(cond)
    } catch (err) {
        return res.json({ success: false, error: err })
    }
    if (!songlist) {
        return res.json({ success: false, error: '找不到该歌单' })
    }
    songlist.songs.map((s, index) => {
       songlist.songs[index] = ObjectID(s)
    })
    cond._id = {$in:  songlist.songs}

    try {
        var songs = await Songs.find(cond).toArray()
    } catch (err) {
        return res.json({ success: false, error: err })
    }
    var data = {}
    data.title = songlist.title
    data.id = songlist._id
    data.pic = songlist.pic
    data.list = songs
    res.json({ success: true, data: data })
}
/*
    musiclist 音乐馆 获取所有歌单 
*/
var getMusiclist = async(req, res) => {
    var cond = {} 
    try {
        var songlists = await Songlists.find(cond, {songs: 0}).toArray()
    } catch (err) {
        return res.json({ success: false, error: err })
    }
    var musiclist = {}
    musiclist.list = songlists
    res.json({ success: true, data: musiclist })
}

/*
    添加收藏 单曲
*/
var addSongTolikes = async(req, res) => {
    var sess = req.session
    if (!sess.loggedIn) {
        return res.json({ success: false, error: '请先登录！' })
    }
    var cond = {}
    var userId = req.session.userId
    var songId = req.body['songId']
    cond._id = ObjectID(userId)
    try {
        var user = await Users.findOne(cond)
    } catch (err) {
        return res.json({ success: false, error: err })
    }
    let n = user.likes.indexOf(songId)

    if (n > -1) {
        user.likes.splice(n, 1)
        sess.likes.splice(n, 1)
        try {
            await Users.save(user)
            return res.json({ success: true, data: user, msg: "已取消收藏！" })
        } catch (err) {
            return res.json({ success: false, error: err })
        }
    }
    if (songId){
        user.likes.push(songId)
        sess.likes.push(songId)
    } 
    try {
        await Users.save(user)
        var userRet = getSelfInfo(sess)
        res.json({ success: true, data: userRet , msg: '已收藏！' }); //前端在调用一次 获取收藏列表的请求
    } catch (err) {
        return res.json({ success: false, error: err })
    }
}

/*
    添加收藏 歌单 to 我的歌单
*/
var addSonglistTolikes = async(req, res) => {
    var sess = req.session
    if (!sess.loggedIn) {
        return res.json({ success: false, error: '请先登录！' })
    }
    var cond = {}
    var userId = req.session.userId
    var songlistId = req.body['songlistId']
    cond._id = ObjectID(userId)
    try {
        var user = await Users.findOne(cond)
    } catch (err) {
        return res.json({ success: false, error: err })
    }


    let n = user.songlist.indexOf(songlistId)

    if (n > -1) {
        user.songlist.splice(n, 1)
        sess.songlist.splice(n, 1)
        try {
            await Users.save(user)
            return res.json({ success: true, data: user, msg: "已取消收藏！" })
        } catch (err) {
            return res.json({ success: false, error: err })
        }
    }

    user.songlist.push(songlistId)
    sess.songlist.push(songlistId)
    console.log(user)
    try {
        await Users.save(user)
        var userRet = getSelfInfo(user)
        res.json({ success: true, data: userRet }); //前端在调用一次 获取收藏列表的请求
    } catch (err) {
        return res.json({ success: false, error: err })
    }

}
/*
    最近播放同播放列表使用缓存
*/


var getSelfInfo = (sess) => {
    var userRet = {
        loggedIn: sess.loggedIn,
        userId: sess.userId,
        username: sess.username,
        likes: sess.likes,
        history: sess.history,
        songlist: sess.songlist
    }
    return userRet
}

var getUserRet = (user) => {
    var userRet = {
        _id: user._id,
        username: user.username,
        likes: user.likes,
        history: user.history,
        songlist: user.songlist
    }
    return userRet
}
module.exports = {
    createUser,
    login,
    logout,
    getSelf,
    addSongTolikes,
    addSonglistTolikes,
    getMusiclist,
    getSonglist,
    getlikes,
    getPlaylist
}
