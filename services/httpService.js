(function() {
    'use strict';
    angular
        .module('myApp', [])
        .service('httpService', function($scope, $http, config) {
            $scope.requestData = function(method, type, body) {
                let token = JSON.parse(localStorage.getItem('token'));
                if (method == 'get') {
                    $http.get(config.apiUrl + type, { headers: { 'x-access-token': token } }).success(function(response) {
                        return response;
                    });
                }
            }


        })
})();