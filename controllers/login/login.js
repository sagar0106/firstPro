(function() {
    'use strict';
    angular.module('myApp')
        .controller('loginCtrl', ['$scope', '$http', '$location', 'config', '$rootScope', function($scope, $http, $location, config, $rootScope) {

            $scope.user = {};
            $scope.login = function() {
                $http.post("http://localhost:4000/login", $scope.user).success(function(response) {
                    $scope.user = {};
                    if (response) {
                        //    this.cookieService.set('vc4token', JSON.stringify(this.userData.token));
                        localStorage.setItem('token', JSON.stringify(response.token));
                        localStorage.setItem('userData', JSON.stringify(response.user));
                        $rootScope.user = response.user;
                        $rootScope.isLogin = true;
                        $location.path("/projects");
                    }
                });
            }

        }]);
})();