/**
 * Created by some on 2017/4/25.
 */
//全局顶部导航
InfantStore.directive('indexHeader',[function(){
    return {
        restrict:'E',
        replace:true,
        templateUrl:'../controller/header.html',
        controller:function($scope){

        }
    }
}]);
//全局底部导航条
InfantStore.directive('indexFooter',[function(){
    return {
        restrict:'E',
        replace:true,
        templateUrl:'../controller/footer.html',
        controller:function($scope,$location){
            console.log($location.url())
            $scope.locationUrl = $location.url();
        }
    }
}]);
//订单顶部导航条
InfantStore.directive('orderNav',[function(){
    return {
        restrict:'E',
        replace:true,
        templateUrl:'../controller/orderNav.html',
        controller:function($scope,$location){
            $scope.locationUrl = $location.url();
        }
    }
}]);