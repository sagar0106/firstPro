(function() {
    'use strict';
    angular.module('myApp')
        .controller('toDoCtrl', ['$scope', '$http', '$routeParams', '$location', 'config', function($scope, $http, $routeParams, $location, config) {

            $scope.projectId = $routeParams.id;
            var refresh = function() {
                let token = JSON.parse(localStorage.getItem('token'));
                //     headers.append('Content-Type', 'application/json');
                $http.get(config.apiUrl + 'project/' + $scope.projectId, { headers: { 'x-access-token': token } }).success(function(response) {
                    response.toDo.forEach(element => {
                        if (element.isCompleted) {
                            element.isCompleted = 'Yes';
                        } else {
                            element.isCompleted = 'No';
                        }
                    });
                    $scope.itemList = response.toDo;
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
                if ($scope.item.isCompleted == 'Yes') {
                    $scope.item.isCompleted = true;
                } else if ($scope.item.isCompleted == 'No') {
                    $scope.item.isCompleted = false;
                }
                if ($scope.item._id) {

                    $http.patch(config.apiUrl + 'toDo/' + $scope.item._id, $scope.item, { headers: { 'x-access-token': token } }).success(function(response) {
                        refresh();
                    })
                } else {
                    $http.post(config.apiUrl + 'toDo', $scope.item, { headers: { 'x-access-token': token } }).success(function(response) {
                        var body = { $push: { toDo: [response._id] } };
                        $http.patch(config.apiUrl + 'project/' + $scope.projectId, body, { headers: { 'x-access-token': token } }).success(function(res) {
                            refresh();
                        })
                    });
                }
            };

            $scope.remove = function(id) {
                let token = JSON.parse(localStorage.getItem('token'));
                $http.delete(config.apiUrl + 'toDo/' + id).success(function(response) {
                    var body = { $pullAll: { toDo: [id] } };
                    $http.patch(config.apiUrl + 'project/' + $scope.projectId, body, { headers: { 'x-access-token': token } }).success(function(res) {
                        refresh();
                    })
                });
            };

            $scope.edit = function(id) {
                let token = JSON.parse(localStorage.getItem('token'));
                $http.get(config.apiUrl + 'toDo/' + id, { headers: { 'x-access-token': token } }).success(function(response) {
                    if (response.isCompleted) {
                        response.isCompleted = 'Yes';
                    } else {
                        response.isCompleted = 'No';
                    }
                    $scope.item = response;
                });
            };

            $scope.deselect = function() {
                $scope.item = "";
            }
            $scope.moveItemUp = function() {
                var index = $scope.itemList.indexOf($scope.selectedItem);

                if (index <= 0) {
                    return;
                } else {
                    var removed = $scope.itemList.splice(index, 1);
                    $scope.itemList.splice(index - 1, 0, removed[0]);
                }
            }
            $scope.moveItemDown = function() {
                var index = $scope.itemList.indexOf($scope.selectedItem);

                if (index >= $scope.itemList.length - 1) {
                    return;
                } else {
                    var removed = $scope.itemList.splice(index, 1);
                    $scope.itemList.splice(index + 1, 0, removed[0]);
                }
            }
            $scope.selectRow = function(item, index) {
                if (item.isSelected) {
                    $scope.selectedItem = item;
                }
                $scope.itemList.forEach(elem => {
                    if (elem != item) {
                        if (elem.isSelected) {
                            elem.isSelected = !elem.isSelected;
                        }
                    }
                })
            }

        }]);
})();