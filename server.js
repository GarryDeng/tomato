var express = require('express'), //引入express模块
    MongoClient = require("mongodb").MongoClient,//操作数据模块
    DB_URL      = "mongodb://localhost:27017/xiaofu",//mongodb数据库
	session = require('express-session'),//引入express-session模块
	cookieParser = require('cookie-parser'),//引入cookie-parser模块
	mongoStore = require('connect-mongo')(session),
	http = require('http'),//引入http模块

    app =express(),
	server = http.createServer(app);//这是创建一个http服务来连接网站
	MongoClient.connect(DB_URL);//这是操作mongodb node的操作模块 连接到mongodb去
	app.use(express.static(__dirname));//指定静态html文件位置
	server.listen(8989);//监听端口

	app.use(cookieParser());//使用到cookie-parser模块来连接客户端与服务端，因为http请求，是请求完后就会断开，所以需要session与cookie两者来维持
	app.use(session({
		secret:'graduation',
		store: new mongoStore({//一般session有常用的三种保存方式，一种记录在内存中，但是在服务器重启后，保存的session就会丢失，
								// 所以一般是保存在数据库最为保险，现在用到的就是保存在数据库中
			url:DB_URL,
			collection:'sessions'
		})
	}));
	require('./config/controllers')(app,MongoClient,DB_URL);//后台接口
	require('./port/controllers')(app);//网站接口
