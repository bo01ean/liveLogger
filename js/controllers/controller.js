var liveLoggerApp = angular.module('liveLoggerApp', ['ngGrid','ui.bootstrap']);

var ModalInstanceCtrl = function ($scope, $modalInstance, content) {

    $scope.content = content;
    $scope.selected = {

    };

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

liveLoggerApp.controller('LiveLogCtrl', function ($scope, $http, $modal, $log) {

    $scope.logs = [];
    $scope.filterOptions = {        filterText: ''    };
    $scope.detail = '<span ng-click="openModal(row.entity[col.field],\'lg\')"><pre>{{row.entity[col.field]}}</pre></span>';

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
        modalInstance.result.then(function () {

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.gridOptions = {
        data:'logs',
        showGroupPanel: true,
        filterOptions: $scope.filterOptions,
        columnDefs: [
            { field: 'host', displayName: 'Host', width: "10%" },
            { field: 'log', displayName:'Log', cellTemplate: $scope.detail, width:"80%"},
            { field: 'caller', displayName: 'Caller', cellTemplate: $scope.detail, width: "10%" }
        ]
    };

    var socket = io.connect("http://localhost:8888");

    socket.on('connected',function(data){
        $scope.$apply(function(){});
        console.log("connected!");
    });

    socket.on('action',function(data){
        $scope.$apply(function(){});
        console.log(data);
    });

    socket.on('log',function(data){
        $scope.$apply(function(){$scope.logs.unshift(data);});
        console.log(data);
    });

});