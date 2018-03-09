/**
 * Created by some on 2017/4/27.
 */
exports.user        = db.collection('station_user');//注册用户信息表
exports.address     = db.collection('station_address');//记录注册用户地址信息表
exports.cartlist    = db.collection('station_cart');//记录注册用户购物车信息表