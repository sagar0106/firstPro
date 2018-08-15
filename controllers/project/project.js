(function() {
    'use strict';
    angular.module('myApp')
        .controller('AppCtrl', ['$scope', '$http', '$location', 'config', '$rootScope', function($scope, $http, $location, config, $rootScope) {

            var refresh = function() {
                let token = JSON.parse(localStorage.getItem('token'));
                //   headers.append('Content-Type', 'application/json');
                $http.get(config.apiUrl + 'project', { headers: { 'x-access-token': token } }).success(function(response) {
                    $scope.itemList = response.data;
                    $scope.item = "";
                }).catch(function(err) {
                    // Handle error here
                    if (err.status == 401) {
                        $location.path('/login');
                    }
                });
            };

            refresh();

            $scope.add = function() {
                let token = JSON.parse(localStorage.getItem('token'));
                if ($scope.item._id) {
                    $http.patch(config.apiUrl + 'project/' + $scope.item._id, $scope.item, { headers: { 'x-access-token': token } }).success(function(response) {
                        refresh();
                    })
                } else {
                    $http.post(config.apiUrl + 'project', $scope.item, { headers: { 'x-access-token': token } }).success(function(response) {
                        refresh();
                    });
                }
            };

            $scope.remove = function(id) {
                let token = JSON.parse(localStorage.getItem('token'));
                $http.delete(config.apiUrl + 'project/' + id, { headers: { 'x-access-token': token } }).success(function(response) {
                    refresh();
                });
            };

            $scope.edit = function(id) {
                let token = JSON.parse(localStorage.getItem('token'));
                $http.get(config.apiUrl + 'project/' + id, { headers: { 'x-access-token': token } }).success(function(response) {
                    $scope.item = response;
                });
            };

            $scope.deselect = function() {
                $scope.item = "";
            }

            function checkPermission(data) {
                var permissions = $rootscope.user.permissions;

            }

        }]);
})();