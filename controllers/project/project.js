(function() {
    'use strict';
    angular.module('myApp')
        .controller('AppCtrl', ['$scope', '$http', '$location', 'config', '$rootScope', function($scope, $http, $location, config, $rootScope) {

            var refresh = function() {
                $scope.showModal = false;
                let token = JSON.parse(localStorage.getItem('token'));
                //   headers.append('Content-Type', 'application/json');
                $http.get(config.apiUrl + 'project', { headers: { 'x-access-token': token } }).success(function(response) {
                    $scope.itemList = checkPermission(response.data);
                    $scope.item = "";
                    $http.get(config.apiUrl + 'module', { headers: { 'x-access-token': token } }).success(function(data) {
                        $scope.modules = data.data;
                    })
                }).catch(function(err) {
                    // Handle error here
                    if (err.status == 401) {
                        $location.path('/login');
                    }
                });
            };

            refresh();

            $scope.add = function(item) {
                let token = JSON.parse(localStorage.getItem('token'));
                if ($scope.item._id) {
                    $http.patch(config.apiUrl + 'project/' + $scope.item._id, item, { headers: { 'x-access-token': token } }).success(function(response) {
                        refresh();
                    })
                } else {
                    $http.post(config.apiUrl + 'project', item, { headers: { 'x-access-token': token } }).success(function(response) {
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
                    $scope.showModal = true;
                });
                // $scope.item = angular.copy(item);
            };

            $scope.deselect = function() {
                $scope.item = "";
            }

            function checkPermission(data) {
                var permissions = $rootScope.user.permissions;
                var finalData = [];
                data.forEach(element => {
                    if (permissions[element.module] && permissions[element.module][element._id]) {
                        finalData.push(element);
                    }
                });
                return finalData;
            }

        }])
        .directive('modal', function() {
            return {
                template: '<div class="modal fade">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                    '<h4 class="modal-title">{{ item.content.title }}</h4>' +
                    '</div>' +
                    '<div class="modal-body" ng-transclude></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>',
                restrict: 'E',
                transclude: true,
                replace: true,
                scope: true,
                link: function postLink(scope, element, attrs, ctrl) {
                    //   scope.title = attrs.title;
                    scope.$watch(attrs.visible, function(value) {

                        if (value)
                            $(element).modal('show');
                        else
                            $(element).modal('hide');
                    });
                }
            };
        });
})();