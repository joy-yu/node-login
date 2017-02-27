var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var mongoose = require('mongoose');
var user = require('../models/user').user;
mongoose.connect('mongodb://localhost/admin'); //连接数据库admin



/* GET index page. */
router.get('/', function(req, res) {
  if(!req.session.user){
    res.render('index', {
      title: '首页'
    });
  } else{
    res.redirect('/homepage'); 
  }
});


/* 登出页面 */
router.get('/logout', function(req, res) {
  req.session.user = null;  
  res.render('logout', {
    title: '登出'
  });
});

/* 注册成功页面 */
router.get('/regsuccess', function(req, res) {
 if(req.session.user){
    res.render('regsuccess', {
      title: '注册成功！'
    });
  } else{
    res.redirect('/'); 
  }
});



/* 注册页 */  
router.route("/register")
.get(function(req, res) {
  res.render("register", {
    title: '注册页~'
  });
})

.post(function(req, res) {

  var uid = req.body.userid;
  var upwd = req.body.password;
  var uhash;

  user.findOne({
    userid: uid
  }, function(err, doc) {
    if (err) {
      res.sendStatus(500);
      console.log(err);
    } else if (doc) {
      res.json({regState: 0});
      console.log('用户名已存在！');
    } else {

      //加密
      crypto.randomBytes(31, function(err, salt) {
        if (err) {
          throw err;
        }

        uhash = crypto.pbkdf2Sync(upwd, salt.toString('hex'), 10000, 256, 'sha512');
        uhash = uhash.toString('hex');

        // 创建一组user对象置入model
        user.create({
          userid: uid,
          password: uhash,
          salt: salt.toString('hex')
        }, function(err, doc) {
          if (err) {
            res.sendStatus(500);
            console.log(err);
          } else {
            req.session.user = doc;
            res.json({regState: 1});
            console.log('注册成功！');
          }
        });
      });
    }
  });
});


/*登陆验证*/
router.route("/homepage")
.get(function(req, res) {

  if(req.session.user){
    res.render('homepage', {
      title: '主页'
    });
  } else{
    res.redirect('/'); 
  }
})

.post(function(req, res) {
  //console.log(req.body);  //键名为网页的表单name{ userid: 'admin', password: '123456789' }
  var uid = req.body.userid;
  var upwd = req.body.password;
  var uhash;
  //通过此model以用户名的条件，查询数据库中的匹配信息  
  user.findOne({userid: uid},function(err,doc){ 

    //错误就返回500的错误 
    if (err) {
      res.sendStatus(500);
      console.log(err);

    //用户名不存在 
    } else if (!doc) { 
      console.log('用户名不存在！');
      res.json({loginState:0});

    } else {
      uhash = crypto.pbkdf2Sync(upwd, doc.salt, 10000, 256, 'sha512');
      uhash = uhash.toString('hex');

      //查询到匹配用户名的信息，密码错误
      if (uhash !== doc.password) { 
        console.log('密码错误！');
        res.json({loginState:0});

       //信息匹配成功
      } else {
        req.session.user = doc;
        console.log('登陆成功！');
        res.json({loginState:1});
      }
    }
  });

/*    user.count(query_doc, function(err, doc) {

      if (doc == 1) {
        console.log(query_doc.userid + ': login success in ' + new Date());
        res.render('homepage', {
          title: 'homepage'
        });
      } else {
        console.log(query_doc.userid + ': login failed in ' + new Date());
        res.redirect('/');
      }
    });*/

});

module.exports = router;
