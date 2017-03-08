var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function ($scope, $http) {
    console.log('from the controller');
    $scope.isEditing = false;
    var refresh = function () {
        $http.get('/sitelist').then(function (response) {
            console.log('i got the data', response);
            $scope.sites = response.data;
            $scope.site = undefined;
        });
    };

    refresh();

    $scope.addSite = function () {
        console.log($scope.site);
        if (isNaN($scope.site.latitude) || isNaN($scope.site.longitude)) {
            alert('Error');
            refresh();
        } else {
            $http.post('/sitelist', $scope.site).then(function (response) {
                console.log(response.data);
                refresh();
            });
        }
    };

    $scope.remove = function (id) {
        console.log(id, 'to be removed');
        $http.delete('/sitelist/' + id).then(function (response) {
            refresh();
        })
    };

    $scope.edit = function (id) {
        console.log(id, 'to be edit');
        $http.get('/sitelist/' + id).then(function (response) {
            $scope.site = response.data;
            $scope.isEditing = true;
        })
    };

    $scope.update = function () {
        console.log($scope.site._id);
        if (isNaN($scope.site.latitude) || isNaN($scope.site.longitude)) {
            alert('Error');
            refresh();
        } else {
            $http.put('/sitelist/' + $scope.site._id, $scope.site).then(function (response) {
                $scope.isEditing = false;
                refresh();
            })
        }
    };

    $scope.deselect = function () {
        $scope.site = undefined;
        $scope.isEditing = false;
    }
}]);