# node-login

这是一个拥有注册、登陆功能小实例，基于express和mongodb。  
麻雀虽小，五脏俱全，这个小实例实现了以下功能：  

> * 支持邮箱、手机号两种注册方式。
> * 密码长度为6-16位。
> * 以上使用正则表达式进行初步验证，提交表单使用ajax进行数据验证。
> * 使用了express-session中间件，实现免登陆验证。
> * 通过crypto模块，使用crypto.randomBytes方法随机生成盐，使用crypto.pbkdf2Sync方法对密码加盐。
> * mongodb数据库保存形式{userid: String,password: String,salt: String}。


不过。。也遇到了很多坑：  

> * 图片验证码功能，发现node有坑，暂搁置。。[知乎链接](https://www.zhihu.com/question/32156977)
> * 表单刷新重提交，表单提交清空表单值。。使用ajax代替原生提交。
> * 服务器响应ajax请求不会进行redirect，因为此时接受到302请求的是JS而不是浏览器，可在前端进行跳转。
> * 中间件顺序的坑。。务必先使用中间件，再使用路由。

运行本项目，你得进行的步骤：  
```
安装mongodb
mongodb --dbpath="路径"
本项目使用了admin数据库，如果需要请切换数据库:use admin
cd node-login
npm install
npm start
```
