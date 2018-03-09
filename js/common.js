/**
 * Created by some on 2017/4/24.
 */
//添加购物车
function addCart(dataId,$http,callback){
    $http({
        method:'post',
        url:'/station/add/cart',
        data:{goodsId:dataId},
        timeout:1000
    }).then(function(res){
        console.log(res)
        if(res.data.code==0){
            location.href = '#/login';
        }else{
            alert(res.data.message);
            callback();
        }
    },function(err){
        alert(err);
    });
}
//删除购物车中商品
function deleteCart(dataId,$http){
    $http({
        method:'post',
        url:'/station/delete/cart',
        data:{goodsId:dataId},
        timeout:1000
    }).then(function(res){
        if(res.data.code==0){
            location.href = '#/login'
        }else{
            alert(res.data.message);
            location.reload();
        }
    },function(err){
        alert(err);
    });
}
//减少购物车中的商品
function reduceCart(dataId,$http){
    $http({
        method:'post',
        url:'/station/reduce/cart',
        data:{goodsId:dataId},
        timeout:1000
    }).then(function(res){
        console.log(res)
        if(res.data.code==0){
            location.href = '#/login'
        }else{
            alert(res.data.message);
            location.reload();
        }
    },function(err){
        alert(err);
    });
}
//提交新地址
function postNewAddress($http){
    var userName = $(".user-name").val();
    var detailedAddress = $(".attr-txt").val();
    var callNumber = $(".call-number").val();
    if(userName==""||detailedAddress==""||callNumber=="") return alert('请填写完整信息');
    $http({
        method:'post',
        url:'/station/add/address',
        data:{userName:userName,detailedAddress:detailedAddress,callNumber:callNumber},
        timeout:1000
    }).then(function(res){
        console.log(res)
        if(res.data.code==1){
            alert(res.data.message);
            history.go(-1);
        }
    },function(err){
        alert(err);
    });
}
//保存编辑地址
function postSingleAddress($routeParams){
    var userName = $(".user-name").val();
    var detailedAddress = $(".attr-txt").val();
    var callNumber = $(".call-number").val();
    if(userName==""||detailedAddress==""||callNumber=="") return alert("请填写完整的信息!");
    $.post('/station/update/address/'+$routeParams.id,{userName:userName,detailedAddress:detailedAddress,callNumber:callNumber},function(data){
        if(data.code==1){
            alert(data.message);
            history.go(-1);
        }
    })
}
//设置默认地址
function defaultAddress(addressId){
    $.post('/station/default/address',{addressId:addressId},function(data){
        if(data.code==1) history.go(-1);
    });
}
function JM(){}
JM.rem = function(){
    var html = document.documentElement;
    html.style.width = 100+"%";
    html.style.height = 100+"%";
    html.style.overflowX = "hidden";
    var screenW = html.clientWidth;
    html.style.fontSize = 0.1 * screenW + "px";
};
window.onresize = function(){
    JM.rem();
};
JM.rem();