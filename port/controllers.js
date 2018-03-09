/**
 * Created by some on 2017/4/21.
 */
var bodyParser = require('body-parser'),//引入body-parser模块
    adminModule = require('./admin'),
    //创建application/x-www-form-urlencoded编码解析
    urlencodedParser = bodyParser.urlencoded({extended:false,limit:'100000kb'});
module.exports = function(app){
    app.get('/station/getUser',adminModule.getUser);//获取用户登录情况
    app.get('/station/cart',adminModule.getCartList);//获取购物车列表信息接口
    app.get('/station/get/address',adminModule.getAddress);//获取所有地址信息接口
    app.get('/station/compile/address/:id',adminModule.compileAddress);//编辑地址信息接口
    app.get('/station/get/accountOrder',adminModule.accountOrder);//获取结算订单信息接口
    app.get('/station/check/order',adminModule.checkAllOrder);//获取订单信息接口
    app.get('/station/check/order/:id',adminModule.checkSingleOrder);//获取种类订单信息接口
    app.get('/station/check/one/order/:id',adminModule.checkOneOrder);//获取单个订单信息接口
    app.get('/station/check/favorite',adminModule.checkFavorite);//查找收藏商品信息接口
    app.post('/station/delete/address',urlencodedParser,adminModule.deleteAddress);//删除单个地址信息接口
    app.post('/station/default/address',urlencodedParser,adminModule.setDefaultAddress);//设置默认地址信息接口
    app.post('/station/update/address/:id',urlencodedParser,adminModule.postCompileAddress);//保存编辑地址信息接口
    app.post('/station/register',urlencodedParser,adminModule.register);//注册接口
    app.post('/station/login',urlencodedParser,adminModule.login);//登录接口
    app.post('/station/logout',urlencodedParser,adminModule.logout);//登出接口
    app.post('/station/add/address',urlencodedParser,adminModule.addAddress);//添加地址信息接口
    app.post('/station/add/cart',urlencodedParser,adminModule.addCart);//添加商品到购物车
    app.post('/station/reduce/cart',urlencodedParser,adminModule.reduceGoods);//减少购物车上商品的数量
    app.post('/station/delete/cart',urlencodedParser,adminModule.deleteCartGoods);//删除购物车上商品接口
    app.post('/station/create/order',urlencodedParser,adminModule.createOrder);//生成订单接口
    app.post('/station/edit/order',urlencodedParser,adminModule.editOrder);//编辑订单接口
    app.post('/station/add/favorite',urlencodedParser,adminModule.addFavorite);//添加收藏商品接口
    app.post('/station/remove/favorite',urlencodedParser,adminModule.removeFavorite);//移除收藏商品接口
};