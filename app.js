(function() {
    'use strict';

    angular
        .module('myApp', ['ngRoute'])
        .config(config)
        .run(run)

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/projects', {
                templateUrl: 'controllers/project/project.html',
                controller: 'AppCtrl'
            })

        .when('/projects/:id', {
                templateUrl: 'controllers/toDo/toDo.html',
                controller: 'toDoCtrl'

            })
            .when('/users', {
                templateUrl: 'controllers/user/user.html',
                controller: 'userCtrl'
            })

        .when('/users/:id', {
                templateUrl: 'controllers/register/register.html',
                controller: 'registerCtrl'

            })
            .when('/users/:id', {
                templateUrl: 'controllers/register/register.html',
                controller: 'registerCtrl'

            })
            .when('/managePermissions', {
                templateUrl: 'controllers/permission/permission.html',
                controller: 'EditRolePermissionsController as vm'
            })
            .when('/login', {
                templateUrl: 'controllers/login/login.html',
                controller: 'loginCtrl'
            })
            .when('/register', {
                templateUrl: 'controllers/register/register.html',
                controller: 'registerCtrl'
            })
            .when('/home', {
                templateUrl: 'controllers/home/home.html',
                controller: 'homeCtrl'
            })


        .otherwise({ redirectTo: '/login' });
    }

    function run($rootScope, $location) {
        $rootScope.$on('$routeChangeStart', function(event) {
            let token = JSON.parse(localStorage.getItem('token'));
            let userData = JSON.parse(localStorage.getItem('userData'));
            if (!token) {
                console.log('DENY');
                //   event.preventDefault();
                $rootScope.isLogin = false;
                $location.path('/login');
            } else {
                console.log('ALLOW');
                $rootScope.isLogin = true;
                $rootScope.user = userData;
                //  $location.path('/home');
            }
        });
    };

    // function config($stateProvider, $urlRouterProvider) {
    //     // default route
    //     $urlRouterProvider.otherwise("/");

    //     $stateProvider
    //         .state('projects', {
    //             url: '/projects',
    //             templateUrl: 'controllers/project/project.html',
    //             controller: 'AppCtrl',
    //             // controllerAs: 'vm',
    //         })
    //         .state('account', {
    //             url: '/account',
    //             templateUrl: 'account/index.html',
    //             controller: 'Account.IndexController',
    //             controllerAs: 'vm',
    //             data: { activeTab: 'account' }
    //         });
    // }

    // function run($http, $rootScope, $window) {
    //     // add JWT token as default auth header
    //     $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

    //     // update active tab on state change
    //     $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    //         $rootScope.activeTab = toState.data.activeTab;
    //     });
    // }

    // manually bootstrap angular after the JWT token is retrieved from the server
    // $(function() {
    //     // get JWT token from server
    //     $.get('/app/token', function(token) {
    //         window.jwtToken = token;

    //         angular.bootstrap(document, ['myApp']);
    //     });
    // });
})();