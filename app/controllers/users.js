var Users = db.collection('users');
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
        like: [],
        songlist: []
    };
    var userCheck = await Users.findOne({ 'username': username })
    if (userCheck) return res.json({ success: false, error: '用户已存在！' });
    try {
        await Users.insert(data)
    } catch (err) {
        console.error(err)
        return res.json({ success: false, error: '创建失败：' + err })
    }
    res.json({ success: true, data: { _id: [data._id] } });
}

var login = async(req, res) => {
    var sess = req.session;
    var query = req.query || {}
    console.log(sess)
    var username = req.body['username']
    var password = req.body['password']

    var user = await Users.findOne({ username: username })
    console.log(password, user.password)
    if (password == user.password) {
        sess.loggedIn = true
        sess.userId = user._id
        sess.username = user.username
        sess.history = user.history
        sess.like = user.like
        sess.songlist = user.songlist
        var userRet = getSelfInfo(sess)
        return res.json({ success: true, data: userRet })
    } else {
        return res.json({success: false, error: "密码错误！"})
    }
}

var logout = async(req, res) => {
    var sess = req.session;
    sess.loggedIn = false

}

var getSelf = async(req, res) => {
    var sess = req.session;
    console.log(sess)
    if (sess.loggedIn) {
        try {
            console.log(sess.userId)
            var user = await Users.findOne({ _id: ObjectID(sess.userId) })
            console.log(user)
        } catch (err) {
            // sess.loggedIn = false;
            console.log(err)
            return res.json({ success: false, error: '406请重新登录' })
        }
    } else { 
        sess.msg = "确实存储了"
        return res.json({ success: false, error: '407请重新登录' })
    }

    if (!user) {
        // sess.loggedIn = false
        return res.json({ success: false, error: '408请重新登录' })
    }
    var userRet = getSelfInfo(sess)
    return res.json({ success: true, data: userRet})
}

var getSelfInfo = (sess) => {
    var userRet = {
        loggedIn: sess.loggedIn,        
        userId: sess.userId,
        username: sess.username,
        like: sess.like,
        history: sess.history,
        songlist: sess.songlist
    }
    return userRet
}
module.exports = {
    createUser,
    login,
    getSelf
}
