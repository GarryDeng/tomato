var MongoClient = require("mongodb").MongoClient,//操作数据模块
    DB_URL      = "mongodb://localhost:27017/xiaofu";
     var data = {"name":"admin","password":"123456"};
	MongoClient.connect(DB_URL,function(error,db){
		// console.log(datains.a());
		 dataBase.findDataBase(db,data);
	});

	//增加
var dataBase = {
	insertData:function(db,data){
		var devices = db.collection('adminuser');//连接到表
		//var data = {"name":"admin","password":123456,"addTime":new Date()};
		devices.insert(data,function(error,result){
			if(error){
				console.log('Error'+error);
			}else{
				console.log(result.result.n)
			}
			db.close();
		});
	},

	//查找多次
	findDataBase:function(db,data,callback){
		var devices = db.collection('adminuser');//连接到表
		//查询数据
		//var data = {"name":"admin","password":123456};
		/*devices.find(data,function(error,cursor){//全部查找
			cursor.each(function(error,doc){
				if(doc){
					console.log(doc);
					if(doc.addTime){
						console.log("addTime"+doc.addTime);
					};
				};
			});
		});*/
		devices.findOne(data,function(error,cursor){//查找一个
			if(cursor==null){//查找不到则插入
				dataBase.insertData(db,data);
			}else{
				console.log(cursor);
				db.close();
			}
		});
	},
	findOneDataBase:function(){
		var devices = db.collection('adminuser');//连接到表

	}
	/*//连接
	MongoClient.connect(DB_URL,function(error,db){
		console.log("连接成功!");
		findDataBase(db);
	});*/
}
