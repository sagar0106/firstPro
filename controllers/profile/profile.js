(function() {
    'use strict';
    angular.module('myApp')
        .controller('profileCtrl', ['$scope', '$http', '$routeParams', '$location', 'config', function($scope, $http, $routeParams, $location, config) {

            $scope.user = {};
            $scope.userId = $routeParams.id;
            $scope.getUser = function() {
                let token = JSON.parse(localStorage.getItem('token'));
                $http.post(config.apiUrl + 'user/' + $scope.userId, { headers: { 'x-access-token': token } }).success(function(response) {
                    $scope.user = {};
                    if (response) {
                        $scope.user = response.data;
                    }
                });
            }
            $scope.clearUser = function() {
                $scope.user = {};
            }
            getUser();


        }]);
})();