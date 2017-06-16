'use strict';

/**
 * @ngdoc function
 * @name minionsManagedNgApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the minionsManagedNgApp
 */
angular.module('minionsManagedNgApp')
  .controller('MainCtrl', function ($scope, mmApi) {
    $scope.workerTypes = ['gecko-t-win7-32', 'gecko-t-win7-32-gpu', 'gecko-t-win10-64', 'gecko-t-win10-64-gpu', 'gecko-1-b-win2012', 'gecko-2-b-win2012', 'gecko-3-b-win2012'];
    $scope.dataCenters = ['use1', 'use2', 'usw1', 'usw2', 'euc1'];
    $scope.selected = {
      workerType: $scope.workerTypes[0],
      dataCenter: $scope.dataCenters[0]
    };
    $scope.loading = true;
    mmApi.query({}, function (minions) {
      $scope.counts = {};
      $scope.workerTypes.forEach(function(workerType) {
        $scope.counts[workerType] = { count: 0 };
        $scope.dataCenters.forEach(function(dataCenter) {
          $scope.counts[workerType][dataCenter] = minions.filter(function(minion){ return minion.workerType == workerType && minion.dataCenter == dataCenter; }).length;
          $scope.counts[workerType].count += $scope.counts[workerType][dataCenter];
        });
      });
      $scope.allMinions = minions;
      $scope.minions = minions.filter(function(minion){ return minion.workerType == $scope.selected.workerType; });
      $scope.loading = false;
    });
    $scope.getData = function(){
      $scope.loading = true;
      $scope.minions = $scope.allMinions.filter(function(minion){ return minion.workerType == $scope.selected.workerType; });
      $scope.loading = false;
    }
  });
