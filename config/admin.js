var MongoClient = require("mongodb").MongoClient,//操作数据模块
    DB_URL      = "mongodb://localhost:27017/xiaofu";//mongodb数据库
exports.userMode = function (req, res) {//判断用户登录信息
    if (req.session.adminList) {
        res.json({'code': 1, 'message': '已登录'});
    } else {
        res.json({'code': 0, 'message': '请登录'});
    }
};

exports.logout = function (req, res) {//退出登录
    delete req.session.adminList;
    res.json({code: 1, message: "已退出登录"});
};

exports.addGoods = function (req, res) {//添加后台商品
    if (req.session.adminList) {
        var resphonse = {
            dataId: req.body.dataId
        };
        MongoClient.connect(DB_URL, function (error, db) {
            var devices = db.collection('goods');//连接到表
            devices.findOne(resphonse, function (error, cursor) {
                if (!cursor) {
                    devices.insert({
                        dataId: req.body.dataId,
                        data_title: req.body.data_title,
                        data_price: req.body.data_price,
                        data_details: req.body.data_details,
                        data_img: req.body.data_img
                    }, function (error, result) {
                        if (error) {
                            console.log('Error' + error);
                        } else {
                            res.json({'code': 1, 'message': '提交成功'});
                        }
                    });
                } else {
                    res.json({'code': 1, 'message': '商品Id已存在'});
                }
                db.close();
            });
        });
    } else {
        res.json({'code': 0, 'message': '请登录'});

    }
};
exports.deleteGoods = function (req, res) {//删除后台商品
    if (req.session.adminList) {
        var resphonse = {
            dataId: req.body.dataId
        };
        MongoClient.connect(DB_URL, function (error, db) {
            var devices = db.collection('goods');
            devices.findOne(resphonse, function (error, cursor) {
                if (!cursor) {
                    res.json({'code': 1, 'message': '没找到该商品'});
                } else {
                    devices.remove(resphonse, function (error) {
                        if (error) {
                            console.log('Error' + error);
                        } else {
                            res.json({'code': 1, 'message': '删除成功！'});
                        }
                    });
                }
                db.close();
            });
        });
    } else {
        res.json({'code': 0, 'message': '请登录'});
    }
};
exports.getGoods = function (req, res) {
    MongoClient.connect(DB_URL, function (error, db) {
        var devices = db.collection('goods');
        devices.find({}).toArray(function (err, result) {
            if (err) {
                console.log('err:' + err);
            } else {
                var data = {'code': 1, res: result};
                res.send(data);
            }
        });
        db.close();
    });
};
exports.getSingleGoods = function(req, res) {
    MongoClient.connect(DB_URL, function (error, db) {
        var devices = db.collection('goods');
        var resphonse = {dataId: req.params.id};
        devices.findOne(resphonse, function (err, result) {
            if (err) {
                console.log('err:' + err);
            } else {
                var data = {'code': 1, res: result};
                res.send(data);
            }
        });
        db.close();
    });
};
exports.getUser = function (req, res) {
    MongoClient.connect(DB_URL, function (error, db) {
        var devices = db.collection('station_user');
        devices.find().toArray(function (err, result) {
            if (err) console.log('err:' + err);
            else {
                var data = {'code': 1, res: result};
                res.send(data);
            }
        });
        db.close();
    });
};
exports.getGoodsList = function (req, res) {
    MongoClient.connect(DB_URL, function (error, db) {
        var devices = db.collection('station_order_list');
        devices.find().sort({"orderId":-1}).toArray(function (err, result) {
            if (err) console.log('err:' + err);
            else {
                var data = {'code': 1, res: result};
                res.send(data);
            }
        });
    });
};
exports.adminLogin = function(req,res){//管理员登录请求
    MongoClient.connect(DB_URL,function(error,db){
        var devices = db.collection('adminuser');
        devices.findOne({
            name:req.body.name,
            password:req.body.password
        },function(error,cursor){
            if(cursor==null){
                res.json({code:1000,message:"账号密码错误！"});
            }else{
                req.session.adminList = cursor;
                res.json({code:1,message:"登陆成功！"});
            }
            db.close();
        });
    });
};
exports.editGoodsDetails = function(req,res){//编辑商品信息
    if (req.session.adminList) {
        MongoClient.connect(DB_URL, function (error, db) {
            var callBase =  db.collection('goods');
            var data =  {dataId: req.body.dataId};
            callBase.findOne(data,function (error, cursor) {
                if(cursor) {
                    callBase.update(data,{$set:{data_title:req.body.data_title,data_img:req.body.data_img,data_price:req.body.data_price,data_details:req.body.data_details}},function(error){
                        if(error) console.log("update goods error:"+ error);
                        res.json({code:1,message:"修改成功！"})
                    })
                }else {
                    res.json({code: 0, message: "商品信息不存在！"});
                }
            });
        });
    }else{
        res.json({code:0,message:"请登录！"})
    }
};
exports.searchGoodsName = function(req,res){//查询商品信息
    MongoClient.connect(DB_URL, function (error, db) {
        var callBase =  db.collection('goods');
        callBase.find({data_title:{$regex:req.query.data_title}}).toArray(function(error,result){
            res.json({code:1,res:result});
        });
    });
};
exports.searchStationEmail = function(req,res){//查询用户信息
    MongoClient.connect(DB_URL, function (error, db) {
        var callBase =  db.collection('station_user');
        callBase.find({email:{$regex:req.query.email}}).toArray(function(error,result){
            res.json({code:1,res:result});
        });
    });
};