var Users = db.collection('users');
var createUser = async (req, res)=> {
    // var sess = req.session;
    // if (sess.loggedIn !== true) {
    //     return res.status(403).end();
    // }   
    var username = req.body['username'];
    var password = req.body['password'];
    var passwordConfirm = req.body['passwordConfirm'];
    console.log(username, passwordConfirm)

    if (password !== passwordConfirm) {
        return res.json({ success: false, error: '密码不一致！' });
    }

    var data = {
        username: username,
        password: password,
        passwordConfirm: passwordConfirm
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
 
module.exports = {
    createUser
}
