var mongoose = require("mongoose");  //  顶会议用户组件
var Schema = mongoose.Schema;    //  创建模型

//  定义一个新的模型，但是此模式还未和users集合有关联
var userScheMa = new Schema({
    userid: String,
    password: String,
    salt: String
});

//  与users集合关联。对应数据库操作的db.createCollection('users')
exports.user = mongoose.model('users', userScheMa);
