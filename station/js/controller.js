//标题
station.controller('nav',function($http,$scope,$location){
  $scope.loactionUrl = $location.url();
  $http({
    method:'get',
    url:'/index',
    timeout:15000
  }).success(function(response){
      $scope.code = response.code;
  }).error(function(data){
      console.log(data);
  });
});
//首页
station.controller('index-controller',function($http,$scope){
  document.title = indexTitle + whloeTitle;
  $http({
    method:'get',
    url:'/index',
    timeout:15000
  }).success(function(response){
      if(response.code == 0){
        location.href = '/station/login.html';
      }
  }).error(function(data){
      console.log(data);
  });
});
//商品列表
station.controller('goods',function($http,$scope){
   document.title = goodsTitle + whloeTitle;
  $http({
        method:'get',
        url:'/getgoodslist',
        timeout:15000
    }).success(function(response){
        $scope.goodsList = response.res;
    }).error(function(data){
        alert(data);
  });
  $scope.deleteGoods = function(dataId){
    $.post("/delete/goods_id",{dataId:dataId},function(data){
      if(data.code==1){
        alert(data.message);
        location.reload();
      }
    });
  };
  $scope.searchGoods = function () {
      $http({
          method:'get',
          url:'/search/goods/name',
          params:{data_title:$(".form-control").val()},
          timeout:15000
      }).success(function(response){
          $scope.goodsList = response.res;
          console.log(response)
      }).error(function(data){
          alert(data);
      });
  }
});
//编辑商品信息
station.controller('goodsEdit',function($http,$scope,$routeParams){
  document.title = goodsEditTitle + whloeTitle;
  $http({
      method:'get',
      url:'/goods_detalis/'+$routeParams.id,
      timeout:15000
    }).success(function(response){
        $scope.goodsList = response.res;
    }).error(function(data){
        alert(data);
    });
    $scope.goodsDetails = function(){
      editGoodsDetails();
  };
});
//用户信息
station.controller('userInfo',function($http,$scope){
  document.title = userInfoTitle + whloeTitle;
    $http({
        method:'get',
        url:'/station/user',
        timeout:15000
    }).success(function(response){
        $scope.goodsList = response.res;
        console.log(response);
    }).error(function(data){
        alert(data);
    });
    $scope.searchStationEmail = function(email){
        $http({
            method:'get',
            url:'/search/station/email',
            params:{email:email},
            timeout:1500
        }).success(function(response){
            $scope.goodsList = response.res;
            console.log(response);
        }).error(function(data){
            alert(data);
        });
    }
});
//添加商品信息
station.controller('addGoods',function($http,$scope){
  document.title = addGoodsTitle + whloeTitle;
  $scope.goodsDetails = function(){
      addGoods();
  };
});
//订单信息
station.controller('Order',function($http,$scope){
  document.title = orderTitle + whloeTitle;
  console.log(1)
    $http({
        method:'get',
        url:'/station/order/list',
        timeout:15000
    }).success(function(response){
        $scope.goodsList = response.res;
        console.log(response);
    }).error(function(data){
        alert(data);
    });
});
//header模板
station.directive('indexHeader',[function(){
    return {
        restrict:'E',
        replace:true,
        templateUrl:'./header.html',
        controller:function($scope){
            console.log(1)
        }
    }
}]);
