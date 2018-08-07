(function() {
    'use strict';
    angular.module('myApp')
        .controller('registerCtrl', ['$scope', '$http', '$routeParams', '$location', 'config', function($scope, $http, $routeParams, $location, config) {

            $scope.user = {};
            $scope.saveUser = function() {
                let token = JSON.parse(localStorage.getItem('token'));
                if ($scope.user._id) {
                    $http.patch(config.apiUrl + 'user/' + $scope.user._id, $scope.user, { headers: { 'x-access-token': token } }).success(function(response) {
                        $scope.user = {};
                        $location.path("/users");
                    });
                } else {
                    $http.post(config.apiUrl + 'user', $scope.user, { headers: { 'x-access-token': token } }).success(function(response) {
                        $scope.user = {};
                        $location.path("/users");
                    });
                }
            }

            $scope.getUser = function() {
                $scope.userId = $routeParams.id;
                if ($routeParams.id) {
                    let token = JSON.parse(localStorage.getItem('token'));
                    $http.get(config.apiUrl + 'user/' + $routeParams.id, { headers: { 'x-access-token': token } }).success(function(response) {
                        $scope.user = {};
                        if (response) {
                            $scope.user = response;
                        }
                    });
                } else {
                    $scope.user = {};
                }
            }
            $scope.clearUser = function() {
                $scope.user = {};
            }
            $scope.getUser();


        }]);
})();