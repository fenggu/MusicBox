var Users = db.collection('users');
var Songs = db.collection('songs');
var Songlists = db.collection('songlists');
var formidable = require('formidable')
var fs = require("fs");
var path = require("path");
var passwordUtil = require('./password.js')
var dir = "./build/" //文件上传地址
var local = '/'
/*注册*/
var createUser = async(req, res) => {
    var username = req.body['username'];
    var password = req.body['password'];
    var passwordConfirm = req.body['passwordConfirm'];
    if (password !== passwordConfirm) {
        return res.json({
            success: false,
            error: '密码不一致！'
        });
    }

    var data = {
        username: username,
        password: passwordUtil.saltHashPassword(password),
        history: [],
        likes: [],
        songlist: []
    };
    try {
        var userCheck = await Users.findOne({
            'username': username
        })
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }
    if (userCheck) {
        return res.json({
            success: false,
            error: '用户已存在！'
        });
    }
    try {
        await Users.insert(data)
    } catch (err) {
        console.error(err)
        return res.json({
            success: false,
            error: '创建失败：' + err
        })
    }
    res.json({
        success: true,
        data: {
            _id: [data._id]
        }
    });
}
//登录
var login = async(req, res) => {
    var sess = req.session;
    var params = req.params || {}
    var username = req.body['username']
    var password = req.body['password']

    var user = await Users.findOne({
        username: username
    })
    if (!user) {
        return res.json({
            success: false,
            error: "账号不存在"
        })
    }
    // if (password == user.password) {
    if (passwordUtil.compare(user.password, password)) {
        sess.loggedIn = true
        sess.userId = user._id
        sess.username = user.username
        sess.history = user.history
        sess.likes = user.likes
        sess.songlist = user.songlist
        var userRet = getSelfInfo(sess)
        console.log(userRet)
        return res.json({
            success: true,
            data: userRet
        })
    } else {
        return res.json({
            success: false,
            error: "密码错误！"
        })
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
    return res.json({
        success: true,
        data: userRet
    })

}
//自动登录 获取session
var getSelf = async(req, res) => {
    var sess = req.session;
    if (sess.loggedIn) {
        try {
            var user = await Users.findOne({
                _id: ObjectID(sess.userId)
            })

        } catch (err) {
            return res.json({
                success: false,
                error: '请重新登录'
            })
        }
    } else {
        return res.json({
            success: false,
            error: '请重新登录'
        })
    }

    if (!user) {
        return res.json({
            success: false,
            error: '408请重新登录'
        })
    }
    var userRet = getSelfInfo(sess)
    return res.json({
        success: true,
        data: userRet
    })
}

//获取全部音乐或者指定音乐
var getsongs = async(req, res, next) => {
    var cond = {}
    var data = {}
    data.title = '全部音乐'
    data.id = 'all'
    var query = req.query || {}
    if (req.query.name && req.query.name != 'undefined') {
        data.title = '搜索结果'
        data.id = 'search'
        cond['title'] = {
            $regex: new RegExp(req.query.name),
            $options: 'i'
        }
    }
    try {
        var songs = await Songs.find(cond).toArray()
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }
    if (!songs) {
        return res.json({
            success: false,
            error: '列表为空'
        })
    }
    songs.map(s => {
        s.url = local + s.url

        if (s.pic) {
            s.pic = local + s.pic
        }
        if (s.lrc) {
            try {
                s.lrc = fs.readFileSync(dir + s.lrc).toString()
            } catch (err) {
                console.log(err)
            }

        }
    })
    data.list = songs
    data.pic = '../public/mdl.png'
    return res.json({
        success: true,
        data: data
    })
}

var getsongsOnlyNames = async(req, res) => {
    // var sess = req.session;
    // if (!sess.loggedIn) {
    //     return res.json({ success: false, error: '请先登录, 暂无播放列表' })
    // }
    var cond = {}
    if (req.body.name) {
        cond['title'] = {
            $regex: new RegExp(req.body.name),
            $options: 'i'
        }
    }
    var sort = {
        'title': 1
    }

    try {
        var songs = await Songs.find(cond, {
            _id: 1,
            title: 1
        }).sort(sort).toArray()
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }
    if (!songs) {
        return res.json({
            success: false,
            error: '列表为空'
        })
    }

    var data = {}
    data.list = songs
    return res.json({
        success: true,
        data: data
    })
}

var delsong = async(req, res) => {
    var sess = req.session;
    if (!sess.loggedIn) {
        return res.json({
            success: false,
            error: '请先登录!'
        })
    }
    var cond = {}
    var id = req.params.id
    if (req.params.id) {
        cond._id = ObjectID(req.params.id)
    } else {
        return res.json({
            success: false,
            error: '缺少参数'
        })
    }

    try {
        var song = await Songs.findOne(cond)
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }
    if (song.username) {
        if (song.username !== sess.username && sess.username !== "administrator") {
            return res.json({
                success: false,
                error: '您无权删除别人上传的音乐!'
            })
        }
    }
    var users = await Users.find({
        likes: id
    }).toArray()

    if (users) {
        for (let i = 0; i < users.length; i++) {
            var a = users[i]
            var num = a.likes.indexOf(id)
            if (num > -1) {
                a.likes.splice(num, 1)
            }
            await Users.save(a)
        }
    }

    var mp3 = song.url
    var lrc = song.lrc
    var pic = song.pic
    fs.unlink(dir + mp3, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log("音乐删除成功！");
    });
    fs.unlink(dir + lrc, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log("歌词删除成功！");
    });
    fs.unlink(dir + pic, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log("图片删除成功！");
    });

    try {
        var song = await Songs.remove(cond)
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }
    return res.json({
        success: true,
        data: cond._id
    })
}

var addsongs = async(req, res) => {
    var sess = req.session
    if (!sess.loggedIn) {
        return res.json({
            success: false,
            error: '请先登录'
        })
    }
    var cond = {}
    var fields = ['title', 'author', 'url', 'pic', 'lrc', 'username']
    var data = {}
    fields.map(function (f) {
        var v = req.body[f];
        if (req.body[f])
            data[f] = v;
    });
    data.createdAt = new Date()
    console.log(data)
    try {
        var song = await Songs.insert(data)
    } catch (err) {
        console.error(err)
        return res.json({
            success: false,
            error: '创建失败：' + err
        })
    }
    return res.json({
        success: true,
        data: song._id
    })
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
        return res.json({
            success: false,
            error: '请先登录'
        })
    }
    var cond = {}
    cond['_id'] = ObjectID(sess.userId)
    try {
        var user = await Users.findOne(cond)
        var songlistIds = user.songlist
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }
    var Ids = []
    if (!songlistIds) {
        return res.json({
            success: false,
            error: '列表为空'
        })
    }
    songlistIds.map(i => {
        Ids.push(ObjectID(i))
    })
    cond['_id'] = {
        $in: Ids
    }
    try {
        var songlists = await Songlists.find(cond).toArray()
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }
    if (!songlists) {
        return res.json({
            success: false,
            error: '列表为空'
        })
    }

    return res.json({
        success: true,
        data: songlists
    })
}

//获取收藏的单曲
var getlikes = async(req, res) => {
    var cond = {}
    var sess = req.session
    if (!sess.loggedIn) {
        return res.json({
            success: false,
            error: '请先登录！'
        })
    }
    var userId = sess.userId
    cond._id = ObjectID(userId)
    try {
        var user = await Users.findOne(cond)
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }
    // console.log(user)
    var likes = user.likes
    var Ids = []
    likes.map(i => {
        Ids.push(ObjectID(i))
    })
    cond._id = {
        $in: Ids
    }
    console.log(Ids)
    try {
        var songs = await Songs.find(cond).toArray()
    } catch (err) {

        return res.json({
            success: false,
            error: err
        })
    }
    if (!songs) {
        return res.json({
            success: false,
            data: {},
            error: "列表为空，快去添加收藏吧"
        })
    }
    var data = {}
    songs.map(s => {
        s = getlocalSong(s)
    })
    data.list = songs
    data.title = '我的收藏'
    data.id = 'likes'
    data.pic = '../public/mdl.png'
    return res.json({
        success: true,
        data: data
    })
}
/* 获取歌单 通过songlist的id来查找 songs并且返回
    songlist:[
        song{}
    ]
*/
var getSonglist = async(req, res) => {
    var cond = {}
    var params = req.params

    if (params.id == "undefined") {
        return res.json({
            success: false,
            data: {
                list: []
            },
            error: '歌单请求错误！'
        })
    }
    cond._id = ObjectID(params.id)
    try {
        var songlist = await Songlists.findOne(cond)
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }
    if (!songlist) {
        return res.json({
            success: false,
            error: '找不到该歌单'
        })
    }
    songlist.songs.map((s, index) => {
        songlist.songs[index] = ObjectID(s)
    })
    cond._id = {
        $in: songlist.songs
    }

    try {
        var songs = await Songs.find(cond).toArray()
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }
    var data = {}
    data.title = songlist.title
    data.id = songlist._id
    data.pic = local + songlist.pic
    songs.map(s => {
        s = getlocalSong(s)
    })
    data.list = songs
    res.json({
        success: true,
        data: data
    })
}

var delSonglist = async(req, res) => {

    var sess = req.session;
    if (!sess.loggedIn) {
        return res.json({
            success: false,
            error: '请先登录!'
        })
    }

    var cond = {}
    var id = req.body.songlistId
    if (req.body.songlistId) {
        cond._id = ObjectID(req.body.songlistId)
    } else {
        res.json({
            success: false,
            error: '缺少参数'
        })
    }

    var users = await Users.find({
        songlist: id
    }).toArray()
    var songlist = await Songlists.findOne(cond)

    if (songlist.username) {
        if (songlist.username !== sess.username && sess.username !== "administrator") {
            return res.json({
                success: false,
                error: '您无权删除别人创建的列表!'
            })
        }
    }

    if (users) {
        for (let i = 0; i < users.length; i++) {
            var a = users[i]
            var num = a.songlist.indexOf(id)
            if (num > -1) {
                a.songlist.splice(num, 1)
            }
            await Users.save(a)
        }
    }

    var pic = songlist.pic
    fs.unlink(dir + pic, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log("图片删除成功！");
    });

    try {
        await Songlists.remove(cond)
    } catch (err) {
        console.log(err)
        return res.json({
            success: false,
            error: err
        })
    }
    return res.json({
        success: true,
        data: req.body.songlistId
    })
}

var createSonglist = async(req, res) => {
    console.log(req.body)
    var title = req.body['title'];
    var songs = []
    var pic = req.body['pic']
    var type = req.body['type']
    var sess = req.session
    if (!sess.loggedIn) {
        return res.json({
            success: false,
            error: '请先登录'
        })
    }

    var data = {
        title: title,
        songs: [],
        pic: pic,
        type: type,
        createdAt: new Date(),
        username: sess.username
    };
    try {
        var userCheck = await Songlists.findOne({
            'title': title
        })
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }
    if (userCheck) {
        return res.json({
            success: false,
            error: '歌单已存在！'
        });
    }
    try {
        await Songlists.insert(data)
    } catch (err) {
        console.error(err)
        return res.json({
            success: false,
            error: '创建失败：' + err
        })
    }
    res.json({
        success: true,
        data: {
            _id: [data._id]
        }
    });
}

var addsongsToSonglist = async(req, res) => {
    var cond = {}
    var body = req.body
    var songlistId = req.body.songlistId
    var songId = req.body.songId
    try {
        var songIdObj = await ObjectID(songId)
    } catch (err) {
        return res.json({
            success: false,
            error: 'id不合法'
        })
    }
    if (!songId || !songlistId) {
        return res.json({
            success: false,
            error: '缺少参数'
        })
    }
    cond._id = ObjectID(songlistId)
    try {
        var songlist = await Songlists.findOne(cond)
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }
    if (songlist == null) {
        return res.json({
            success: false,
            error: '找不到该歌单'
        })
    }

    try {
        var song = await Songs.findOne({
            _id: songIdObj
        })
    } catch (err) {
        console.log("err:" + err)
        return res.json({
            success: false,
            error: err
        })
    }

    if (!song) {
        return res.json({
            success: false,
            error: '该id不存在'
        })
    }
    if (songlist.songs.indexOf(songId) <= -1) {
        songlist.songs.unshift(songId)
    } else {
        return res.json({
            success: false,
            error: '该歌曲已存在'
        })
    }

    try {
        await Songlists.save(songlist)
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }

    var data = {}
    res.json({
        success: true,
        data: songId
    })
}

var delsongsToSonglist = async(req, res) => {
    var cond = {}
    var body = req.body
    console.log(body)
    var songlistId = req.body.songlistId
    var songId = req.body.songId
    cond._id = ObjectID(songlistId)
    // console.log(cond)
    try {
        var songlist = await Songlists.findOne(cond)
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }
    if (songlist == null) {
        return res.json({
            success: false,
            error: '找不到该歌单'
        })
    }
    var n = songlist.songs.indexOf(songId)
    if (n > -1) {
        songlist.songs.splice(n, 1)
    } else {
        return res.json({
            success: false,
            error: '找不到该歌曲'
        })
    }

    try {
        await Songlists.save(songlist)
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }

    var data = {}
    res.json({
        success: true,
        data: songId
    })
}

/*
    musiclist 音乐馆 获取所有歌单 
*/
var getMusiclist = async(req, res) => {
    var cond = {}
    try {
        var songlists = await Songlists.find(cond, {
            songs: 0
        }).sort({
            'createdAt': -1
        }).toArray()
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }
    var musiclist = {}
    musiclist.list = songlists
    res.json({
        success: true,
        data: musiclist
    })
}

/*
    添加收藏 单曲
*/
var addSongTolikes = async(req, res) => {
    var sess = req.session
    if (!sess.loggedIn) {
        return res.json({
            success: false,
            error: '请先登录！'
        })
    }
    var cond = {}
    var userId = req.session.userId
    var songId = req.body['songId']
    cond._id = ObjectID(userId)
    if (!songId) {
        return res.json({
            success: false,
            error: '缺少参数'
        })
    }
    try {
        var user = await Users.findOne(cond)
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }
    let n = user.likes.indexOf(songId)

    if (n > -1) {
        user.likes.splice(n, 1)
        sess.likes.splice(n, 1)
        try {
            await Users.save(user)
            var userRet = getSelfInfo(sess)
            return res.json({
                success: true,
                data: userRet,
                msg: "已取消收藏！"
            })
        } catch (err) {
            return res.json({
                success: false,
                error: err
            })
        }
    }
    if (songId) {
        user.likes.push(songId)
        sess.likes.push(songId)
    }
    try {
        await Users.save(user)
        var userRet = getSelfInfo(sess)
        res.json({
            success: true,
            data: userRet,
            msg: '已收藏！'
        }); //前端在调用一次 获取收藏列表的请求
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }
}

/*
    添加收藏 歌单 to 我的歌单
*/
var addSonglistTolikes = async(req, res) => {
    var sess = req.session
    if (!sess.loggedIn) {
        return res.json({
            success: false,
            error: '请先登录！'
        })
    }
    var cond = {}
    var userId = req.session.userId
    var songlistId = req.body['songlistId']
    if (!songlistId) {
        return res.json({
            success: false,
            error: '缺少参数'
        })
    }
    cond._id = ObjectID(userId)
    try {
        var user = await Users.findOne(cond)
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }


    try {
        var songlistIdObj = await ObjectID(songlistId)
    } catch (err) {
        return res.json({
            success: false,
            error: 'id不合法'
        })
    }

    let n = user.songlist.indexOf(songlistId)

    if (n > -1) {
        user.songlist.splice(n, 1)
        sess.songlist.splice(n, 1)
        try {
            await Users.save(user)
            var userRet = getSelfInfo(sess)
            return res.json({
                success: true,
                data: userRet,
                msg: "已取消收藏！"
            })
        } catch (err) {
            return res.json({
                success: false,
                error: err
            })
        }
    }

    user.songlist.push(songlistId)
    sess.songlist.push(songlistId)
    try {
        await Users.save(user)
        var userRet = getSelfInfo(user)
        res.json({
            success: true,
            data: userRet
        }); //前端在调用一次 获取收藏列表的请求
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }

}
/*
    最近播放同播放列表使用缓存
*/

var uploadfile = async(req, res) => {
    var obj = {};
    var dirpath = "./build/public/upload"

    if (!fs.existsSync(dirpath)) { //判断路径是否存在 不存在啧创建
        var pathtmp;
        dirpath.split(path.sep).forEach(function (dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname); //如果存在则假如子文件夹
            } else {
                pathtmp = dirname;
            }
            if (!fs.existsSync(pathtmp)) { //创建失败
                if (!fs.mkdirSync(pathtmp)) {
                    return false;
                }
            }
        });
    }

    var form = new formidable.IncomingForm({
        encoding: "utf-8",
        uploadDir: dirpath, //文件上传地址
        keepExtensions: true //保留后缀
    });
    form.parse(req)
        .on('field', function (name, value) { // 字段
            obj[name] = value;
        })
        .on('file', function (name, file) { //文件
            obj[name] = file;
        })
        .on('error', function (error) { //结束
            return res.json({
                success: false,
                error: error
            })
        })
        .on('end', function () { //结束 
            return res.json({
                success: true,
                data: obj
            })
        });
}

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
var getlocalSong = (song) => {
    song.url = local + song.url

    if (song.pic) {
        song.pic = local + song.pic
    }
    if (song.lrc) {
        try {
            song.lrc = fs.readFileSync(dir + song.lrc).toString()
        } catch (e) {
            console.log(e)
            song.lrc = '服务器错误！'
        }
    }
    return song
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
    uploadfile,
    logout,
    getSelf,
    getsongs,
    createSonglist,
    delSonglist,
    addsongsToSonglist,
    delsongsToSonglist,
    getsongsOnlyNames,
    addsongs,
    delsong,
    addSongTolikes,
    addSonglistTolikes,
    getMusiclist,
    getSonglist,
    getlikes,
    getPlaylist
}