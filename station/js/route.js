var station = angular.module('mystation',['ngRoute']);
station.config(['$routeProvider',function($routeProvider){
  $routeProvider
  .when('/',{
    templateUrl:'index-controller.html',
    controller:'index-controller'
  })
  .when('/goods',{
    templateUrl:'goods.html',
    controller:'goods'
  })
  .when('/addgoods',{
    templateUrl:'goodsEdit.html?'+Math.ceil(Math.random()*100),
    controller:'addGoods'
  })
  .when('/goodsEdit/:id',{
    templateUrl:'goodsEdit.html?'+Math.ceil(Math.random()*100),
    controller:'goodsEdit'
  })
  .when('/userInfo',{
    templateUrl:'userInfo.html',
    controller:'userInfo'
  })
  .when('/order',{
    templateUrl:'order.html',
    controller:'Order'
  })
  .otherwise({redirectTo:'/'});
}]);
