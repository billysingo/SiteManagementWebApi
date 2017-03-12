var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function ($scope, $http) {
    console.log("welcome to csbsb. this is Mo's first MEAN stack website");
    $scope.isEditing = false;
    $scope.isInfo = false;
    $scope.detailEditing = {}
    $scope.translate={
        name: '站名',
        latitude: '纬度',
        longitude: '经度'
    };

    var refresh = function () {
        $http.get('/sitelist').then(function (response) {
            //console.log('i got the data', response);
            $scope.sites = response.data;
            if (!$scope.isInfo)
                $scope.site = undefined;
        });
    };

    refresh();

    $scope.addSite = function () {
        console.log($scope.site);
        if (!$scope.site || isNaN($scope.site.latitude) || isNaN($scope.site.longitude)) {
            alert('填写站点名和经纬度');
            refresh();
        } else {
            $scope.site.latitude = parseFloat($scope.site.latitude).toFixed(5);
            $scope.site.longitude = parseFloat($scope.site.longitude).toFixed(5);
            $http.post('/sitelist', $scope.site).then(function (response) {
                console.log(response.data);
                refresh();
                $scope.isEditing=!$scope.isEditing;
            });
        }
    };

    $scope.remove = function (id) {
        if (confirm('确定删除台站吗？此操作不可恢复')){
            console.log(id, 'to be removed');
            $http.delete('/sitelist/' + id).then(function (response) {
            refresh();
            })
        }
        
    };

    // $scope.edit = function (id) {
    //     console.log(id, 'to be edit');
    //     $http.get('/sitelist/' + id).then(function (response) {
    //         $scope.site = response.data;
    //         $scope.isEditing = true;
    //     })
    // };

    $scope.update = function () {
        console.log($scope.site._id);
        for (item in $scope.detailEditing) {
            $scope.detailEditing[item] = false;
        }
        if (isNaN($scope.site.latitude) || isNaN($scope.site.longitude) || !$scope.site.name) {
            alert('确认名称和经纬度是否正确');
            refresh();
        } else {
            $scope.site.latitude = parseFloat($scope.site.latitude).toFixed(5);
            $scope.site.longitude = parseFloat($scope.site.longitude).toFixed(5);
            $http.put('/sitelist/' + $scope.site._id, $scope.site).then(function (response) {
                $scope.isEditing = false;
                refresh();
            })
        }
    };

    $scope.info = function (id) {
        console.log('inDetialMode');
        $http.get('/sitelist/' + id).then(function (response) {
            $scope.site = response.data;
            $scope.isInfo = true;
        })
    }


    // $scope.deselect = function () {
    //     $scope.site = undefined;
    //     $scope.isEditing = false;
    // }

    $scope.returnToHome = function () {
        $scope.isInfo = false;
        $scope.site = undefined;
    }

    $scope.addNewAttribute = function () {
        if (!isNaN($scope.newAttrName) || ($scope.newAttrName in $scope.site) || !$scope.newAttrName) {
            alert('参数名无效');
            $scope.newAttrName = '';
        }
        else {
            $scope.site[$scope.newAttrName] = $scope.newAttrValue;
            $scope.newAttrName = '';
            $scope.newAttrValue = '';
        }
    }

    $scope.delAttribute = function (name) {
        if (['name', 'latitude', 'longitude'].indexOf(name) != -1){
            alert('不能移除名称或经纬度');
        }else{
            delete $scope.site[name];
        }
        
    }

}]);

myApp.controller('MessageCtrl', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {

    var refresh = function () {
        $http.get('/message').then(function (response) {
            $scope.messages = response.data;
        });
    };

    refresh();

    $scope.addMsg = function () {
        if ($scope.name != "" && $scope.msg != "" && $scope.name && $scope.msg) {
            $http.post('/message', {name: $scope.name, msg: $scope.msg}).then(function (response) {
                $scope.name = '';
                $scope.msg = '';
            });
            refresh();
        } else {
            alert('填写名字')
        }

    };

    $scope.replaceText = function (str) {
        var reg = new RegExp("\n", "g");
        str = str.replace(reg, "<br>");
        return $sce.trustAsHtml(str);
    }
}]);