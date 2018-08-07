(function() {
    'use strict';

    angular.module('myApp')
        .controller('NavBarController', NavBarController);

    NavBarController.$inject = ['$window', '$location', '$rootScope'];

    function NavBarController($window, $location, $rootScope) {
        var vm = this;
        vm.logout = logout;
        vm.redirectProfile = redirectProfile;
        vm.Redirect = redirect;

        function logout() {
            localStorage.removeItem('token');
            $rootScope.isLogin = false;
            $location.path('/login');
        }

        function setMenuclose() {
            $timeout(function() {
                return false;
            }, 1500)
        }

        function redirect(path) {
            if (path == "pivot") {
                vm.activePivot = true;
                vm.activeTrend = false;
                vm.activeDevExpress = false;
            } else if (path == "donorXL") {
                vm.activePivot = false;
                vm.activeTrend = false;
                vm.activeDevExpress = true;
            } else {
                vm.activePivot = false;
                vm.activeTrend = true;
                vm.activeDevExpress = false;
            }

        }

        function redirectProfile() {
            if ($rootScope.user.role == "Admin" || $rootScope.user.role == "SubAdmin") {
                $location.path("/profile/" + $rootScope.user.organizationId);
            } else {
                $location.path("/profile/");
            }
        }

    }

})();