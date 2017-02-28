var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var user = require('../models/user').user;


/* 注册页 */  
router.route('/')
.get(function(req, res) {
  res.render('register/register', {
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


/* 注册成功页面 */
router.get('/regsuccess', function(req, res) {
 if(req.session.user){
    res.render('register/regsuccess', {
      title: '注册成功！'
    });
  } else{
    res.redirect('/'); 
  }
});


module.exports = router;
