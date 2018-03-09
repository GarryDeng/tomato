// mongoose 链接
var mongoose = require('mongoose');
var db       = mongoose.connect('mongodb://localhost:27017/test');
// 链接错误
db.connection.on('error', function(error) {
    console.log('数据连接失败'+error);
});

db.connection.on("open", function () {
console.log("——数据库连接成功！——");
});
var Schema = mongoose.Schema;
// Schema 结构
var vipSchema = new Schema({
    name:String,
    age:Number,
    addr:String,
    addTime:Date
});

//添加mongoose 实例方法
vipSchema.methods.findByName = function(hello,callback){
    return this.model('vips').find({name:hello},callback);
}
//添加 mongoose 静态方法，静态方法在Model层就能使用
vipSchema.statics.findbyage = function(age,callback){
    return this.model('vips').find({age:age},callback);
}

//模型
var vipModel = mongoose.model('vips',vipSchema);

vipModel.find({name:'java'},function(error,result){
    if(error){
        console.log(error);
    } else {
        console.log(result);
    }
    //关闭数据库链接
    db.disconnect();
});
