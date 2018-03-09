/**
 * Created by some on 2017/4/21.
 */
//商城主页
InfantStore.controller('Index',function($http,$scope){
    document.title = indexTitle + ngTitle;
    $scope.titleName = indexTitle;
    $http({
        method:'get',
        url:'/getgoodslist',
        timeOut:1500
    }).success(function(resphonse){
        if(resphonse.code==1){
            $scope.goods = resphonse.res;
        }else{
            alert(resphonse.message);
        }
    }).error(function(data){
        alert(data);
    });
    $scope.addCart = function(dataId){
        addCart(dataId,$http);
    }
});
//注册页
InfantStore.controller('Register',function($http,$scope){
    document.title = loginUpTitle + ngTitle;
    $scope.titleName = loginUpTitle;
});
//登录页
InfantStore.controller('Login',function($http,$scope){
    document.title = loginInTitle + ngTitle;
    $http({
        method:'get',
        url:'/station/getUser',
        timeOut:1500
    }).success(function(resphose){
        if(resphose.code==1){
            location.href = '#/';
        }
    }).error(function(data){
        alert(data);
    })
});
//购物车
InfantStore.controller('Cart',function($http,$scope){
    document.title = cartTitle + ngTitle;
    $scope.titleName = cartTitle;
    $http({
        method:'get',
        url:'/station/cart',
        timeOut:1500
    }).success(function(resphose){
        if(resphose.code==1){
            $scope.cartList = resphose.res;
            $scope.total = resphose.total;
        }else if(resphose.code==0){
            alert(resphose.message);
            location.href = '#/login';
        }
    }).error(function(data){
        alert(data);
    });
    $scope.deleteCart = function(dataId){
        deleteCart(dataId,$http);
    };
    $scope.addCart = function(dataId){
        addCart(dataId,$http,function(){
            location.reload();
        });
    };
    $scope.reduceCart = function(dataId){
        reduceCart(dataId,$http);
    }
});
//联系我们
InfantStore.controller('Contact',function($scope){
    document.title = contactTitle + ngTitle;
    $scope.titleName = contactTitle;
});
//确认订单
InfantStore.controller('ConfirmOrder',function($scope){
    document.title = contactTitle + ngTitle;
    $scope.titleName = contactTitle;
});
//个人中心
InfantStore.controller('User',function($scope,$http){
    document.title = userTitle + ngTitle;
    $scope.titleName = userTitle;
    $http({
        method:'get',
        url:'/station/getUser',
        timeOut:1000
    }).success(function(result){
        if(result.code==0) location.href="#/login";
        $scope.userName = result.result;
    }).error(function(data){
        alert(data);
    });
    $scope.logout = function () {
        $http({
            method:'post',
            url:'/station/logout',
            timeout:1000
        }).then(function(res){
            alert(res.data.message);
            if(res.data.code==1) location.href="#/login";
        },function(err){
            alert(err);
        });
    };
});
//结算订单
InfantStore.controller('ConfirmOrder',function($scope,$http){
    document.title = confirmOrderTitle + ngTitle;
    $scope.titleName = confirmOrderTitle;
    $http({
        method:'get',
        url:'/station/get/accountOrder',
        timeOut:1000
    }).success(function(result){
        $scope.orderGoods = result[0];
        $scope.orderAddress = result[1];
        $scope.createOrder = function(){
            $http({
                method:'post',
                url:'/station/create/order',
                data:{addressId:$scope.orderAddress.result.addressId},
                timeout:1000
            }).then(function(res){
                if(res.data.code==1) location.href="#/pay/"+res.data.orderId;
                else alert(res.data.message);
            },function(err){alert(err)});
        };
        $scope.editOrder = function(){
            $.post("/station/edit/order",{addressId:$scope.orderAddress.result.addressId})
        }
    }).error(function(data){
        alert(data);
    });
});
//支付订单
InfantStore.controller('Pay',function($scope,$http,$routeParams){
    document.title = payTitle + ngTitle;
    $scope.titleName = payTitle;
    $http({
        method:'get',
        url:'/station/check/one/order/'+$routeParams.id,
        timeOut:1500
    }).success(function(result){
        // var orderId = result.result.orderId;
        // var total = result.result.goods.total;
        $scope.orderId = result.result.orderId;//订单编号
        $scope.total = result.result.goods.total;//支付金额
        
        // if(result.result.type == 1&&confirm("订单号：--------------------"+orderId+"-------------------"
        //           +"支付金额:-------------------"+total+"---------------------"
        //           +"是否立即支付?")){
        //     $http({
        //         method:'post',
        //         url:'/station/edit/order',
        //         data:{orderId:$routeParams.id},
        //         timeout:1000
        //     }).then(function(res){
        //         if(res.data.code==1) {
        //             alert("支付成功！");
        //             location.href = '#/awaitGoods'
        //         }
        //         else{
        //             alert(res.data.message);
        //         }
        //     },function(err){alert(err)});
        // }
        // else if(result.result.type != 1) location.href = '#/';
        // else{
        //     location.href = '#/awaitPay';
        // }
    }).error(function(data){
        alert(data);
    });
});
//地址列表
InfantStore.controller('AddressList',function($scope,$http){
    document.title = addressListTitle + ngTitle;
    $scope.titleName = addressListTitle;
    $http({
        method:'get',
        url:'/station/get/address',
        timeOut:1500
    }).success(function(result){
        $scope.code = result.code;
        $scope.addressList = result.result;
    }).error(function(data){
        alert(data);
    });
    $scope.deleteAddress = function(addressId){
        $http({
            method:'post',
            url:'/station/delete/address',
            data:{addressId:addressId},
            timeout:1000
        }).then(function(res){
            if(res.data.code==1){
                alert(res.data.message);
                location.reload();
            }else{
                alert(data.message);
            }
        },function(err){alert(err)});
    };
    $scope.getAddress = function(addressId){
        location.href = "#/newAddress/"+addressId;
    };
    $scope.defaultAddress = function(addressId){
        defaultAddress(addressId);
    }
});
//编辑地址
InfantStore.controller('CompileAddress',function($scope,$http,$routeParams){
    $http({
        method:'get',
        url:'/station/compile/address/'+$routeParams.id,
        timeOut:1500
    }).success(function(result){
        console.log(result)
        $scope.singleAddress = result.result;
    }).error(function(data){
        alert(data);
    });
    $scope.postNewAddress = function(){
        postSingleAddress($routeParams);
    };
});
//添加新地址
InfantStore.controller('NewAddress',function($scope,$http){
    document.title = newAddressTitle + ngTitle;
    $scope.titleName = newAddressTitle;
    $scope.postNewAddress = function(){postNewAddress($http)};
});
//我的收藏
InfantStore.controller('Favorites',function($scope,$http){
    document.title = favoritesTitle + ngTitle;
    $scope.titleName = favoritesTitle;
    $http({
        method:'get',
        url:'/station/check/favorite',
        timeOut:1500
    }).success(function(result){
        console.log(result)
        if(result.code==1){
            $scope.data = result.result;
        }else{
            alert(result.message);
        }
    }).error(function(data){
        console.log(data);
    });
    $scope.addCart = function(favoritesId){
        addCart(favoritesId,$http);
    };
    $scope.removeFavorite = function(favoriteId){
        $http({
            method:'post',
            url:'/station/remove/favorite',
            data:{favoriteId:favoriteId},
            timeout:1000
        }).then(function(res){
            if(res.data.code==1){
                alert(res.data.message);
                location.reload();
            }
        },function(err){alert(err)});
    };
});
//全部订单
InfantStore.controller('AllOrder',function($scope,$http){
    document.title = allOrderTitle + ngTitle;
    $scope.titleName = allOrderTitle;
    $http({
        method:'get',
        url:'/station/check/order',
        timeOut:1500
    }).success(function(result){
        console.log(result);
        $scope.data = result.result;
    }).error(function(data){
        alert(data);
    });
    $scope.confirmOrder = function(orderId){
        if(confirm("是否确认签收?")){
            $http({
                method:'post',
                url:'/station/edit/order',
                data:{orderId:orderId},
                timeOut:1000
            }).success(function(result){
                console.log(result)
                if(result.code==1) {
                    alert("签收成功！");
                    location.href = '#/completeGoods'
                }
                else{
                    alert(result.message);
                }
            }).error(function(data){
                alert(data);
            });
        }
    }
});
//待付款
InfantStore.controller('AwaitPay',function($scope,$http){
    document.title = awaitPayTitle + ngTitle;
    $scope.titleName = awaitPayTitle;
    $http({
        method:'get',
        url:'/station/check/order/'+1,
        timeOut:1500
    }).success(function(result){
        console.log(result);
        $scope.data = result.result;
    }).error(function(data){
        alert(data);
    });
});
//待收货
InfantStore.controller('AwaitGoods',function($scope,$http){
    document.title = awaitGoodsTitle + ngTitle;
    $scope.titleName = awaitGoodsTitle;
    $http({
        method:'get',
        url:'/station/check/order/'+2,
        timeOut:1500
    }).success(function(result){
        console.log(result);
        $scope.data = result.result;
    }).error(function(data){
        alert(data);
    });
    $scope.confirmOrder = function(orderId){
        if(confirm("是否确认签收?")){
            $http({
                method:'post',
                url:'/station/edit/order',
                data:{orderId:orderId},
                timeOut:1000
            }).success(function(result){
                console.log(result)
                if(result.code==1) {
                    alert("签收成功！");
                    location.href = '#/completeGoods'
                }
                else{
                    alert(result.message);
                }
            }).error(function(data){
                alert(data);
            });
        }
    }
});
//已完成
InfantStore.controller('CompleteGoods',function($scope,$http){
    document.title = completeGoodsTitle + ngTitle;
    $scope.titleName = completeGoodsTitle;
    $http({
        method:'get',
        url:'/station/check/order/'+3,
        timeOut:1500
    }).success(function(result){
        console.log(result);
        $scope.data = result.result;
    }).error(function(data){
        alert(data);
    });
});
//商品详情
InfantStore.controller('Details',function($scope,$http,$routeParams){
    document.title = detailsTitle + ngTitle;
    $scope.titleName = detailsTitle;
    $http({
        method:'get',
        url:'/goods_detalis/'+$routeParams.id,
        timeout:15000
    }).success(function(response){
        $scope.goodsList = response.res;
    }).error(function(data){
        alert(data);
    });
    $scope.addCart = function(){
        addCart($routeParams.id,$http);
    };
    $scope.payCart = function(){
        $http({
            method:'post',
            url:'/station/add/cart',
            data:{goodsId:$routeParams.id},
            timeout:15000
        }).then(function(res){
            if(res.data.code==1){
                location.href = '#/cart';
            }else{
                alert(res.message);
                location.href = '#/login';
            }
        },function(err){
            alert('err:'+err);
        });
    };
    $scope.addFavorite = function(){
        $http({
            method:'post',
            url:'/station/add/favorite',
            data:{favoriteId:$routeParams.id},
            timeout:15000
        }).then(function(res){
            if(res.data.code==0){
                alert('请先登陆');
                location.href = '#/login';
            }else{
                alert('收藏成功！');
            }
        },function(err){
            alert('err:'+err);
        });
    }
});
