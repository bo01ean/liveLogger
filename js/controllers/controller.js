var ModalInstanceCtrl = function ($scope, $modalInstance, content) {
    $scope.content = content;
    $scope.selected = {};
    $scope.ok = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

var socket = io.connect("http://localhost:8088");
var app = angular.module('liveLoggerApp', ['ngGrid','ui.bootstrap'])
    .service('socket', function ($rootScope) {
        return {
            on: function (eventName, callback) {
                console.log("on");
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                console.log("emit");
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    })
    .controller('LiveLogCtrl', function ($scope, $modal) {
        $scope.logs = [];
        $scope.filterOptions = {filterText:''};
        $scope.detail = '<span ng-click="openModal(row.entity[col.field],\'lg\')"><pre>{{ row.entity[col.field] }}</pre></span>';

        $scope.openModal = function (data, size) {
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                size: size,
                resolve: {
                    content: function () {
                        return {header:"Detailed Log Output", body:data}
                    }
                }
            });
            modalInstance.result.then(
                function () { },
                function () { $log.info('Modal dismissed at: ' + new Date()); }
            );
        };

        $scope.gridOptions = {
            data:'logs',
            showGroupPanel: true,
            filterOptions: $scope.filterOptions,
            columnDefs: [
                {field: 'host', displayName: 'Host', width: "10%"},
                {field: 'log', displayName:'Log', cellTemplate: $scope.detail, width:"80%"},
                {field: 'caller', displayName: 'Caller', cellTemplate: $scope.detail, width: "10%"}
        ]};

        socket.on('connected',function(data){
            $scope.$apply(function(){});
        });

        socket.on('action',function(data){
            $scope.$apply(function(){});
        });

        socket.on('log',function(data){
            $scope.$apply(function(){$scope.logs.unshift(data);});
        });

        $scope.test = function(){
            socket.emit('test', {host:"localhost", log: "Testing Front End", caller:"Unknown"});
        }

    });
