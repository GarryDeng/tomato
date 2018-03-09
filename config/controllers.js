/**
 * Created by some on 2017/4/20.
 */
var bodyParser = require('body-parser'),//引入body-parser模块
    //创建application/x-www-form-urlencoded编码解析
    urlencodedParser = bodyParser.urlencoded({extended:false,limit:'100000kb'}),
    admin = require('./admin');

module.exports = function(app,MongoClient,DB_URL) {
    app.get('/index', admin.userMode);//登录状态
    app.post('/cancel_user', admin.logout);//退出登录
    app.post('/add_goods', urlencodedParser, admin.addGoods);//添加商品
    app.post('/delete/goods_id', urlencodedParser, admin.deleteGoods);//删除商品
    app.get('/getgoodslist', admin.getGoods);//获取商品
    app.get('/goods_detalis/:id', admin.getSingleGoods);//获取单个商品
    app.get('/station/user', admin.getUser);//获取注册用户信息
    app.get('/station/order/list', admin.getGoodsList);//获取订单列表信息
    app.post('/login_user',urlencodedParser,admin.adminLogin);//管理员登录接口
    app.post('/edit/goods/details',urlencodedParser,admin.editGoodsDetails);//修改商品信息
    app.get('/search/goods/name',urlencodedParser,admin.searchGoodsName);//查找商品信息
    app.get('/search/station/email',urlencodedParser,admin.searchStationEmail);//查找用户信息
};