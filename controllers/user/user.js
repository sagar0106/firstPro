(function() {
    'use strict';
    angular.module('myApp')
        .controller('userCtrl', ['$scope', '$http', '$location', 'config', function($scope, $http, $location, config) {

            var refresh = function() {
                let token = JSON.parse(localStorage.getItem('token'));
                //   headers.append('Content-Type', 'application/json');
                $http.get(config.apiUrl + 'user', { headers: { 'x-access-token': token } }).success(function(response) {
                    $scope.userList = response.data;
                    $scope.user = "";
                }).catch(function(err) {
                    // Handle error here
                    if (err.status == 401) {
                        $location.path('/login');
                    }
                });
            };

            refresh();


            $scope.remove = function(id) {
                let token = JSON.parse(localStorage.getItem('token'));
                $http.delete(config.apiUrl + 'user/' + id, { headers: { 'x-access-token': token } }).success(function(response) {
                    refresh();
                });
            };

            $scope.edit = function(id) {
                let token = JSON.parse(localStorage.getItem('token'));
                $http.get(config.apiUrl + 'user/' + id, { headers: { 'x-access-token': token } }).success(function(response) {
                    $scope.item = response;
                });
            };

            $scope.deselect = function() {
                $scope.item = "";
            }

            $scope.goToLink = function() {
                $location.path('/register');
            }

        }]);
})();