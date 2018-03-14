/**
 * Created by some on 2017/4/24.
 */
var MongoClient = require("mongodb").MongoClient,//操作数据模块
    DB_URL      = "mongodb://localhost:27017/xiaofu";//mongodb数据库
    //baseName    = require('./database_name');
//判断用户是否已经登录
exports.getUser = function(req,res){
    if(req.session.lastPage){
        res.json({code:1,result:req.session.lastPage.email});
    }else{
        res.json({code:0,massage:"用户未登录！"});
    }
};
//获取普通用户购物车列表
exports.getCartList = function(req,res) {
    if (req.session.lastPage) {
        MongoClient.connect(DB_URL, function (error, db) {//连接数据库
            db.collection('station_cart').find({userId: req.session.lastPage._id}).toArray(function (err, result) {
                if (err) {
                    return console.log('error:' + err)
                }
                if (result == null) {
                    res.json({code: 2, message: "购物车为空!"})
                }
                else {
                    var total = 0;
                    for (var i = 0; i < result.length; i++) {
                        total += result[i].data_price * result[i].goodsNumber;
                    }
                    var data = {code: 1, res: result, total: total};
                    res.send(data)
                }
            });
        })
    } else {
        res.json({code: 0, message: "请登录！"});
    }
};
//添加地址
exports.addAddress = function(req,res){
    if (req.session.lastPage) {
        var addressId = new Date().getTime()+""+Math.floor(Math.random()*10000);
        MongoClient.connect(DB_URL, function (error, db) {//连接数据库
            var devices = db.collection('station_address');
            var data = {addressId:addressId,userId: req.session.lastPage._id,userName:req.body.userName,callNumber:req.body.callNumber,
            detailedAddress:req.body.detailedAddress};
            devices.findOne({addressId:addressId,userId: req.session.lastPage._id},function(error,result){
                if(result==null){
                    devices.insert(data,function(error,result){
                        if(error) return console.log("error:"+error);
                        else res.json({code:1,message:"添加成功!"});
                        console.log(result);
                    });
                    devices.findOne({userId: req.session.lastPage._id,setting:true},function(error,cursor){
                        console.log(cursor)
                        if(cursor==null){
                            devices.update(data,{$set:{setting:true}},function(error){
                                if(error) return console.log("error:"+error);
                            });
                        }
                    })
                }else{
                    res.json({code:0,message:"添加失败，请重新提交!"})
                }
            });
        });
    } else {
        res.json({code: 0, message: "请登录！"});
    }
};
//删除地址
exports.deleteAddress = function(req,res){
    if (req.session.lastPage) {
        MongoClient.connect(DB_URL, function (error, db) {//连接数据库
            var devices = db.collection('station_address');
            var data = {addressId:req.body.addressId,userId: req.session.lastPage._id};
            devices.remove(data,function(error){
                if(error) return console.log("error:" + error);
                res.json({code:1,message:"删除成功!"})
            });
            devices.findOne({userId: req.session.lastPage._id,setting:true},function (error,cursor) {
                if(error) console.log("error:"+error);
                if(cursor==null){
                    devices.update({userId: req.session.lastPage._id},{$set:{setting:true}},function(error){
                        if(error) console.log("error:"+error);
                    })
                }
            })
        });
    } else {
        res.json({code: 0, message: "请登录！"});
    }
};
//获取用户地址
exports.getAddress = function(req,res){
    if(req.session.lastPage){
        var addressList = {userId:req.session.lastPage._id};
        MongoClient.connect(DB_URL,function(error,db){
            var devices = db.collection('station_address');
            devices.find(addressList).toArray(function(error,result){
                if(error) return console.log("error:"+error);
                if(result.length==0){
                    res.json({code:1001,message:"没有地址信息"});
                }else {
                    res.json({code:1,result:result});
                }
            });
        })
    } else {
        res.json({code: 0, message: "请登录！"});
    }
};
//获取编辑用户地址
exports.compileAddress = function(req,res){
    if(req.session.lastPage){
        var addressList = {userId:req.session.lastPage._id,addressId:req.params.id};
        MongoClient.connect(DB_URL,function(error,db){
            var devices = db.collection('station_address');
            devices.findOne(addressList,function(error,result){
                if(error) return console.log("error:"+error);
                else res.json({code:1,result:result});
            })
        })
    } else {
        res.json({code: 0, message: "请登录！"});
    }
};
//修改用户地址
exports.postCompileAddress = function(req,res){
    if(req.session.lastPage){
        var addressList = {userId:req.session.lastPage._id,addressId:req.params.id};
        MongoClient.connect(DB_URL,function(error,db){
            var devices = db.collection('station_address');
            devices.findOne(addressList,function(error,result){
                if(error) return console.log("error:"+error);//通用报错信息
                if(result==null){
                    res.json({code:1003,message:"地址不存在！"})
                }else{
                    devices.update(addressList,{$set:{userName:req.body.userName,callNumber:req.body.callNumber,
                        detailedAddress:req.body.detailedAddress}},function(error){
                        if(error) console.log("error:"+error);
                        else res.json({code:1,message:"修改成功！"});
                    })
                }
            });
        })
    } else {
        res.json({code: 0, message: "请登录！"});
    }
};
//设置默认地址
exports.setDefaultAddress = function(req,res){
    if(req.session.lastPage){
        MongoClient.connect(DB_URL,function(error,db){
            var devices = db.collection('station_address');
            devices.findOne({userId:req.session.lastPage._id},function(error,result){
                if(error) return console.log("error:"+error);//通用报错信息
                if(result==null){
                    res.json({code:1003,message:"未有地址信息！"})
                }else{
                    devices.update({userId:req.session.lastPage._id,setting:true},{$set:{setting:false}},function(error){
                        if(error) console.log("error:"+error);
                    });
                    devices.update({userId:req.session.lastPage._id,addressId:req.body.addressId},{$set:{setting:true}},function(error){
                        if(error) console.log("error:"+error);
                        else res.json({code:1,message:"设置成功！"});
                    });
                }
            });
            // db.close();
        })
    } else {
        res.json({code: 0, message: "请登录！"});
    }
};
//删除购物车商品
exports.deleteCartGoods = function (req,res) {
    if(req.session.lastPage){
        MongoClient.connect(DB_URL,function(error,db){
            var devices = db.collection('station_cart');
            devices.remove({userId:req.session.lastPage._id,goodsId:req.body.goodsId},function(error,result){
                if(error) console.log("error:"+error);
                if(result == null) return res.send({code:0,message:"商品不存在!"})
                else res.send({code:1,message:"删除成功！"});
            })
        })
    }
};
//减少购物车中的商品数量
exports.reduceGoods = function(req,res){//减少商品数量
    if(req.session.lastPage){
        var goodsNumber = {userId:req.session.lastPage._id, goodsId:req.body.goodsId};
        MongoClient.connect(DB_URL,function(error,db){//连接数据库
            var devices = db.collection('station_cart');//连接到表
            devices.findOne(goodsNumber,function(error,cursor){//查询数据库是否存在该数据
                if(error){console.log("error:"+error)}
                if(cursor==null){//查询到为空,则表示商品还未被创建
                    res.json({code:3,message:'购物车不存在该商品！'})
                }else{//购物车已存在商品，新增
                    if(cursor.goodsNumber==1){return res.json({code:2,message:'已经是最小数量！'})}
                    devices.update({userId:req.session.lastPage._id,goodsId:cursor.goodsId},//替换目标
                        {$set:{goodsNumber:cursor.goodsNumber-1,overall_price:cursor.data_price*(cursor.goodsNumber-1)}},//需要替换的参数
                        function(error){
                            if(error) console.log("error:"+error);
                            else res.json({code:1,message:"减少成功!"});
                            db.close();
                        });
                }
            });
        });
    }else{
        res.json({code:0,message:"请先登录！"})
    }
};
//添加购物车中的商品数量
exports.addCart = function(req,res){//加入购物车
    if(req.session.lastPage){
        var goodsNumber = {userId:req.session.lastPage._id, goodsId:req.body.goodsId};
        MongoClient.connect(DB_URL,function(error,db){//连接数据库
            var devices = db.collection('station_cart');//连接到表
            devices.findOne(goodsNumber,function(error,cursor){//查询数据库是否存在该数据
                if(error){console.log("error:"+error)}
                if(cursor==null){//查询到为空,则表示商品还未被创建
                    db.collection('goods').findOne({dataId:req.body.goodsId},function(error,cur){//查询商品数据
                        if(error) console.log('error:'+error);
                        if(cur==null){
                            console.log("商品数据丢失!");
                        }else{//商品数据正常
                            devices.insert({//加入购物车数据
                                userId:req.session.lastPage._id,
                                goodsId:req.body.goodsId,
                                data_price:cur.data_price,
                                data_title:cur.data_title,
                                goodsNumber:1,
                                overall_price:cur.data_price,
                                goodsImg:cur.data_img
                            },function(error,cursor){
                                if(error){
                                    console.log('error:'+error);
                                }else{
                                    res.json({code:1,message:"加入购物车成功!"});
                                }
                            })
                        }
                        db.close();
                    });

                }else{//购物车已存在商品，新增
                    devices.update({userId:req.session.lastPage._id,goodsId:cursor.goodsId},//替换目标
                        {$set:{goodsNumber:cursor.goodsNumber+1,overall_price:cursor.data_price*(cursor.goodsNumber+1)}},//需要替换的参数
                        function(error){
                            if(error) console.log("error:"+error);
                            else res.json({code:1,message:"增加成功!",goodsNumber:cursor.goodsNumber+1});
                            db.close();
                        });
                }
            });
        });
    }else{
        res.json({code:0,message:"请先登录！"})
    }
};
//登录
exports.login = function(req,res){//普通用户登录页面
    var user = {email:req.body.email,password:req.body.password};//获取前端提交的密码与账号信息
    MongoClient.connect(DB_URL,function(error,db){//连接数据库
        var devices = db.collection('station_user');//连接到表
        devices.findOne(user,function(error,cursor){//查询数据库是否存在该数据
            if(error) console.log("error:"+error);
            if(cursor==null){//查询到为空
                res.json({code:0,message:"账号密码错误!"});
            }else{
                req.session.lastPage = cursor;
                console.log(cursor)
                res.json({code:1,message:"登录成功！"});
            }
        });
    });
};
//登出
exports.logout = function(req,res){//普通用户登录页面
    delete req.session.lastPage;
    res.json({code:1,message:"登出成功！"});
};
//注册
exports.register = function(req,res){//普通用户注册页面
    var email = {email:req.body.email};
    MongoClient.connect(DB_URL,function(error,db){//连接数据库
        var devices = db.collection('station_user');//连接到表
        devices.findOne(email,function(error,cursor){//查找用户是否已注册
            if(cursor==null){//查询该邮箱未注册
                devices.insert({email:req.body.email,password:req.body.password},function(error,cursor){//给用户进行注册
                    if(error){//注册失败
                        console.log('error:'+error);//后台打印失败信息
                    }else{
                        res.json({code:1,message:'注册成功！'});
                        req.session.lastPage = cursor;//记录用户登录session
                        console.log(req.session.lastPage);
                    }
                });
            }else{
                res.json({code:0,message:'邮箱已注册！'});
            }
        })
    });
};
//结算订单
exports.accountOrder = function(req,res){
    if (req.session.lastPage) {
        MongoClient.connect(DB_URL, function (error, db) {//连接数据库
            var data =[];
            db.collection('station_cart').find({userId: req.session.lastPage._id}).toArray(function (err, result) {
                if (err) {
                    return console.log('error:' + err)
                }
                if (result == null) {
                    res.json({code: 2, message: "购物车为空!"})
                }
                else {
                    var total = 0;
                    for (var i = 0; i < result.length; i++) {
                        total += result[i].data_price * result[i].goodsNumber;
                    }
                    data[0] = {code: 1, res: result, total: total};
                }
                var devices = db.collection('station_address');
                devices.findOne({userId: req.session.lastPage._id,setting:true},function (error,surcor) {
                    if(error) console.log("error:"+error);
                    if(surcor==null){
                        data[1] = {code:1002,result:"地址为空"}
                    }else{
                        data[1] = {code:1001,result:surcor}
                    }
                    res.json(data);
                });
            });

        })
    } else {
        res.json({code: 0, message: "请登录！"});
    }
};

//提交订单
exports.createOrder = function(req,res){
    if (req.session.lastPage) {
        MongoClient.connect(DB_URL, function (error, db) {//连接数据库
            var data ={type:1,userId: req.session.lastPage._id,code:1,goods:"",address:"",state:"",userName:req.session.lastPage.email};
            db.collection('station_cart').find({userId: req.session.lastPage._id}).toArray(function (err, result) {
                if (err) console.log('error:' + err);
                if (!result) res.json({code: 2, message: "请选择购买商品!"});
                else {
                    var total = 0;
                    for (var i = 0; i < result.length; i++) {
                        total += result[i].data_price * result[i].goodsNumber;
                    }
                    data.goods = {res: result, total: total};
                }
                var devices = db.collection('station_address');
                devices.findOne({userId: req.session.lastPage._id ,addressId:req.body.addressId},function (error,surcor) {
                    if(surcor==null){
                        return res.json({code:1002,result:"请选择收货地址！"});
                    }else{
                        data.address = {code:1001,result:surcor}
                    }
                    var orderId = new Date().getTime()+""+Math.floor(Math.random()*10000);
                    data.orderId = orderId;
                    data.typeText = "待付款";
                    data.newTime = getNowFormatDate();
                    db.collection('station_order_list').insert(data,function(error,surcor){
                        if(error) console.log("create order error:" + error);
                        res.json({code:1,message:"生成订单成功！",orderId:orderId});
                        db.collection('station_cart').remove({userId: req.session.lastPage._id},function(error){
                            if(error) console.log("delete cart error:" + error);
                        })
                    })
                });
            });

        })
    } else {
        res.json({code: 0, message: "请登录！"});
    }
};
//查询订单
exports.checkAllOrder = function(req,res){
    if (req.session.lastPage) {
        MongoClient.connect(DB_URL, function (error, db) {//连接数据库
            var devices = db.collection('station_order_list'),data;
            data = {userId: req.session.lastPage._id};
            devices.find(data).toArray(function (err, result) {
                if(err) console.log("find order list error:"+err);
                if(result==null){
                    res.json({code:1005,message:"没有订单信息!"})
                }else{
                    res.json({code:1,result:result})
                }
            });
        })
    } else {
        res.json({code: 0, message: "请登录！"});
    }
};
//查询种类订单
exports.checkSingleOrder = function(req,res){
    if (req.session.lastPage) {
        MongoClient.connect(DB_URL, function (error, db) {//连接数据库
            var devices = db.collection('station_order_list'),data;
            data = {userId: req.session.lastPage._id,type:parseInt(req.params.id)};
            console.log(data);
            devices.find(data).toArray(function (err, result) {
                if(err) console.log("find order list error:"+err);
                if(result==null){
                    res.json({code:1005,message:"没有订单信息!"})
                }else{
                    res.json({code:1,result:result})
                }
            });
        })
    } else {
        res.json({code: 0, message: "请登录！"});
    }
};
//查询单个订单
exports.checkOneOrder = function(req,res){
    if (req.session.lastPage) {
        MongoClient.connect(DB_URL, function (error, db) {//连接数据库
            var devices = db.collection('station_order_list'),data;
            data = {userId: req.session.lastPage._id,orderId:req.params.id};
            devices.findOne(data,function (err, result) {
                if(err) console.log("find one order error:"+err);
                if(result==null){
                    res.json({code:1005,message:"没有订单信息!"})
                }else{
                    res.json({code:1,result:result})
                }
            });
        })
    } else {
        res.json({code: 0, message: "请登录！"});
    }
};
//修改订单进度
exports.editOrder = function(req,res){
    if (req.session.lastPage) {
        MongoClient.connect(DB_URL, function (error, db) {//连接数据库
            var devices = db.collection('station_order_list'),data;
            data = {userId: req.session.lastPage._id,orderId:req.body.orderId};
            console.log(data)
            devices.findOne(data,function(error,cursor){
                if(error) console.log("check order error:" + error);
                if(cursor==null){
                    res.json({code:1006,message:"订单不存在！"});
                }else{
                    var typeText;
                    switch(cursor.type){
                        case 1:typeText="待收货";
                        break;
                        case 2:typeText="已完成";
                        break;
                    }
                    devices.update(data,{$set:{type:cursor.type+1,typeText:typeText}},function(error){
                        if(error) console.log("update order error:"+error);
                        res.json({code:1,message:"提交成功！"});
                    });
                }
            });
        });
    } else {
        res.json({code: 0, message: "请登录！"});
    }
};
//修改订单信息
exports.addOrderMessage = function (req, res) {
    if (req.session.lastPage) {
        MongoClient.connect(DB_URL, function (error, db) {//连接数据库
            var devices = db.collection('station_order_list'), data;
            data = { userId: req.session.lastPage._id, orderId: req.body.orderId };
            console.log(data)
            devices.findOne(data, function (error, cursor) {
                if (error) console.log("check order error:" + error);
                if (cursor == null) {
                    res.json({ code: 1006, message: "订单不存在！" });
                } else {
                    var typeText;
                    switch (cursor.type) {
                        case 1: typeText = "待收货";
                            break;
                        case 2: typeText = "已完成";
                            break;
                    }
                    devices.update(data, { $set: { type: cursor.type + 1, typeText: typeText } }, function (error) {
                        if (error) console.log("update order error:" + error);
                        res.json({ code: 1, message: "提交成功！" });
                    });
                }
            });
        });
    } else {
        res.json({ code: 0, message: "请登录！" });
    }
};
//添加收藏
exports.addFavorite = function(req,res){
    if (req.session.lastPage) {
        MongoClient.connect(DB_URL, function (error, db) {//连接数据库
            var devices = db.collection('station_favorite_goods'),data;
            devices.findOne({userId: req.session.lastPage._id,favoriteId:req.body.favoriteId},
                function(error,cursor){
                    if(error) console.log("check order error:" + error);
                    if(cursor){
                        res.json({code:1007,message:"该商品已在收藏夹！"});

                    }else{
                        db.collection('goods').findOne({dataId:req.body.favoriteId},
                        function (error,result) {
                            if(error) console.log("check goods error:"+error);
                            data = {result:result,userId:req.session.lastPage._id,favoriteId:req.body.favoriteId};
                            devices.insert(data,function(error){
                                if(error) console.log("add newFavorite error:"+error);
                                res.json({code:1,message:"收藏成功!"})
                            })
                        });
                    }
            });
        });
    } else {
        res.json({code: 0, message: "请登录！"});
    }
};
//移除收藏夹
exports.removeFavorite = function(req,res){
    if (req.session.lastPage) {
        MongoClient.connect(DB_URL, function (error, db) {//连接数据库
            var devices = db.collection('station_favorite_goods'),data;
            data = {userId: req.session.lastPage._id,favoriteId:req.body.favoriteId};
            devices.findOne(data,function(error,cursor){
                if(error) console.log("check order error:" + error);
                if(cursor){
                    devices.remove(data,function(error){
                        if(error) console.log("add newFavorite error:"+error);
                        res.json({code:1,message:"移除成功!"})
                    })
                }else{
                    res.json({code:1007,message:"该商品不在收藏夹内！"});
                }
            });
        });
    } else {
        res.json({code: 0, message: "请登录！"});
    }
};
//查找收藏夹
exports.checkFavorite = function(req,res){
    if (req.session.lastPage) {
        MongoClient.connect(DB_URL, function (error, db) {//连接数据库
            var devices = db.collection('station_favorite_goods'),data;
            data = {userId: req.session.lastPage._id};
            devices.find(data).toArray(function(error,cursor){
                if(error) console.log("check newFavorite error:" + error);
                if(cursor){
                    res.json({code:1,result:cursor})
                }else{
                    res.json({code:1007,message:"收藏夹没有商品！"});
                }
            });
        });
    } else {
        res.json({code: 0, message: "请登录！"});
    }
};
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}
