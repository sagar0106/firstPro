(function() {
    'use strict';

    angular
        .module('myApp')
        .controller('EditRolePermissionsController', EditRolePermissionsController);

    EditRolePermissionsController.$inject = ['$log', '$timeout', '$window', '$http', 'config'];

    function EditRolePermissionsController($log, $timeout, $window, $http, config) {
        var vm = this;
        var existingResource;

        vm.canSave = false;
        vm.loaded = true;
        vm.titleMessege = 'Select/Desellect All';

        vm.checkUncheckAll = {
            schemas: {
                view: false,
                create: false,
                edit: false,
                review: false,
                editSchema: false
            },
        };

        vm.fetchForUpdateRole = fetchForUpdateRole;
        vm.fetchForUpdateModule = fetchForUpdateModule;
        vm.checkBoxCheck = checkBoxCheck;
        vm.processAll = processAll;
        vm.saveRolePermissions = saveRolePermissions;
        vm.checkBoxCheckAll = checkBoxCheckAll;
        //   vm.checkDefaultViewPermission = rolePermissions.checkDefaultViewPermission;

        function initiateOnRoleChange() {
            vm.resources = {
                schemas: [],
            }
        }

        // function activate() {
        //     initiateOnRoleChange();

        //     var getAllData = [{
        //         tableName: 'modules',
        //         isActive: true,
        //         select: 'title',
        //         sort: 'title'
        //     }, {
        //         tableName: 'roles',
        //         isActive: true,
        //         select: 'title',
        //         sort: 'title'
        //     }, {
        //         tableName: 'resources',
        //         isActive: true,
        //         select: 'title,entity',
        //         sort: 'title'
        //     }, {
        //         tableName: 'reportTemplates',
        //         isActive: true,
        //         select: 'bookmarkDescription',
        //         sort: 'bookmarkDescription',
        //         query: { isRemoved: false }
        //     }];

        //     $timeout(function () {
        //         vm.loaded = false;
        //     }, drpdwnloadtimeout || 0);

        //     resourceService.getAllAppData(getAllData)
        //         .then(function (response) {
        //             vm.loaded = false;

        //             var data = response.data.plain();

        //             vm.roles = data.roles;
        //             vm.modules = data.modules;
        //             vm.allResources = data.resources;
        //             vm.allReportTemplates = data.reportTemplates;

        //         })
        //         .catch(function (err) {
        //             $log.error(err);
        //         });
        // }

        function activate() {
            initiateOnRoleChange();
            let token = JSON.parse(localStorage.getItem('token'));
            $timeout(function() {
                vm.loaded = false;
            }, 0);
            $http.get(config.apiUrl + 'role', { headers: { 'x-access-token': token } }).success(function(response) {
                vm.roles = response.data;
                $http.get(config.apiUrl + 'module', { headers: { 'x-access-token': token } }).success(function(res) {
                    vm.modules = res.data;
                });
            }).catch(function(err) {
                // Handle error here
                if (err.status == 401) {
                    $location.path('/login');
                }
            });
        }

        function fetchForUpdateRole() {
            if (vm.selectedRoleId) {
                let token = JSON.parse(localStorage.getItem('token'));
                $http.get(config.apiUrl + 'roles/' + vm.selectedRoleId, { headers: { 'x-access-token': token } }).success(function(response) {
                    vm.role = response.data;
                });
            }
        }


        function fetchForUpdateModule() {
            if (vm.selectedRoleId && vm.selectedModuleId) {
                let token = JSON.parse(localStorage.getItem('token'));

                $http.get(config.apiUrl + 'project', { headers: { 'x-access-token': token } }).success(function(response) {

                    vm.resources.schemas = ((response.data || []).map(function(item) {
                        return {
                            '_id': item._id,
                            'title': item.title,
                            'entity': item._id,
                            'entityType': "schemas"
                        };
                    }));

                    // var existingSchemaPermission = ((vm.role.modules || []).find(function(obj) {
                    //     return obj._id == vm.selectedModuleId;
                    // }) || {}).permissions || [];


                    // vm.resources.schemas.forEach(function(schema) {
                    //     existingResource = {};
                    //     existingResource = existingSchemaPermission.find(function(obj) { return obj._id == schema._id });
                    //     if (existingResource) {
                    //         existingResource.title = schema.title;
                    //         angular.extend(schema, existingResource);
                    //     }
                    // });

                    checkBoxCheckAll(vm.resources.schemas, vm.checkUncheckAll.schemas);

                });

            }
        }

        function saveRolePermissions() {

            var module;
            vm.role.modules = (vm.modules || []).map(function(item) {
                module = {};
                module._id = item._id;
                module.permissions = [];
                if (item._id === vm.selectedModuleId) {
                    module.permissions = (module.permissions || []).concat(vm.resources.schemas);
                } else {
                    var currentPermissions = ((vm.role.modules || []).find(function(obj) { return obj._id == item._id }) || {}).permissions || [];
                    vm.oldSchemaAndModulerResource = (currentPermissions || []).filter(function(obj) {
                        return obj.entityType === "schemas";
                    });
                    module.permissions = (module.permissions || []).concat(vm.oldSchemaAndModulerResource);
                }

                return module;
            });

            // vm.role
            //     .save(false)
            //     .then(function() {
            //         $window.scrollTo(0, 0);
            //         qc3Alert.alert('rolePermissions', function() {
            //             vm.canSave = false;

            //             vm.successful = true;
            //             $timeout(function() {
            //                 vm.successful = false;
            //             }, 5000);
            //         });
            //     })
            let token = JSON.parse(localStorage.getItem('token'));

            $http.patch(config.apiUrl + 'roles/' + vm.selectedRoleId, { headers: { 'x-access-token': token } }).success(function(response) {
                    $window.scrollTo(0, 0);
                    vm.canSave = false;

                    vm.successful = true;
                    $timeout(function() {
                        vm.successful = false;
                    }, 5000);
                })
                .catch(function(ex) {
                    $log.error(ex);
                    vm.failed = true;
                    $timeout(function() {
                        vm.failed = false;
                    }, 5000);
                });
        }

        function checkBoxCheck(currentItem) {
            currentItem.view = !!(currentItem.create || currentItem.edit || currentItem.review || currentItem.view);
            currentItem.create = !!(currentItem.edit || currentItem.review || currentItem.create);
            currentItem.edit = !!(currentItem.review || currentItem.edit);
        }

        function processAll(type, allData, checkBoxCheckAllModal) {
            checkBoxCheck(checkBoxCheckAllModal);

            (allData || []).forEach(function(data) {
                data[type] = (type === 'view' && rolePermissions.checkDefaultViewPermission(data.entity)) ? true : checkBoxCheckAllModal[type];
                checkBoxCheck(data);
            });
        }

        function checkBoxCheckAll(data, checkBoxCheckAllModal) {
            checkBoxCheckAllModal['view'] = data.every(function(obj) { return obj.view });
            checkBoxCheckAllModal['create'] = data.every(function(obj) { return obj.create });
            checkBoxCheckAllModal['edit'] = data.every(function(obj) { return obj.edit });
            checkBoxCheckAllModal['review'] = data.every(function(obj) { return obj.review });
            checkBoxCheckAllModal['editSchema'] = data.every(function(obj) { return obj.editSchema });
        }

        activate();
    }
})();