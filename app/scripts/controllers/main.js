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
    $scope.getData = function(workerType, dataCenter) {
      if ($scope.counts[workerType][dataCenter] > 0) {
        $scope.loading = true;
        $scope.selected.workerType = workerType;
        $scope.selected.dataCenter = dataCenter;
        $scope.minions = $scope.allMinions.filter(function(minion){ return minion.workerType === workerType && minion.dataCenter === dataCenter; });
        $scope.loading = false;
      }
    };
    function pluralise (value, period) {
      return ((value === 1) ? period : period + 's');
    }
    $scope.getUptime = function(start) {
      if (start == null) {
        return 'unknown';
      }
      var totalSeconds = ((new Date()) - (new Date(start))) / 1000;
      var days = Math.floor(totalSeconds / 86400);
      var hours = Math.floor((totalSeconds - (days * 86400 )) / 3600)
      var minutes = Math.floor((totalSeconds - (days * 86400 ) - (hours * 3600 )) / 60)
      var seconds = Math.floor((totalSeconds - (days * 86400 ) - (hours * 3600 ) - (minutes * 60)))
      if (days > 0) {
        return days + ' ' + pluralise(days, 'day');
      } else if (hours > 0) {
        return hours + ' ' + pluralise(hours, 'hour');
      } else if (minutes > 0) {
        return minutes + ' ' + pluralise(minutes, 'minute');
      } else {
        return seconds + pluralise(seconds, 'second');
      }
    }
    $scope.getRegion = function(dataCenter){
      switch (dataCenter) {
        case 'use1':
          return 'us-east-1';
        case 'use2':
          return 'us-east-2';
        case 'usw1':
          return 'us-west-1';
        case 'usw2':
          return 'us-west-2';
        case 'euc1':
          return 'eu-central-1';
        default:
          return dataCenter;
      }
    };
  });
