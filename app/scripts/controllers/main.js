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
      state: 'alive',
      workerType: $scope.workerTypes[0],
      dataCenter: $scope.dataCenters[0]
    };
    function getCounts() {
      mmApi.counts(
        {state: $scope.selected.state},
        function (counts) {
          $scope.workerTypes = [];
          $scope.dataCenters = [];
          $scope.counts = {};
          counts.forEach(function(count) {
            if ($scope.workerTypes.indexOf(count._id.workerType) < 0) {
              $scope.workerTypes.push(count._id.workerType);
              $scope.workerTypes.sort();
            }
            if ($scope.dataCenters.indexOf(count._id.dataCenter) < 0) {
              $scope.dataCenters.push(count._id.dataCenter);
              $scope.dataCenters.sort();
            }
            if ($scope.counts[count._id.workerType] == null) {
              $scope.counts[count._id.workerType] = { count: 0 };
            }
            $scope.counts[count._id.workerType][count._id.dataCenter] = count.count;
            $scope.counts[count._id.workerType].count += count.count;
          });
          $scope.loading.counts = false;
        }
      );
    }
    function getChart() {
      mmApi.history(
        {workerType: $scope.selected.workerType,period: 'hour'},
        function (counts) {
          var dates = Array.from(new Set(counts.map(function(count){return pad(count._id.month, 2) + '/' + pad(count._id.day, 2) + ' ' + pad(count._id.hour, 2);})));
          dates.sort();
          var dataCenters = Array.from(new Set(counts.map(function(count){return count._id.dataCenter;})));
          dataCenters.sort();
          $scope.chart = {
            labels: dates,
            series: dataCenters,
            data: dataCenters.map(function(dataCenter){
              return dates.map(function(date){
                return (counts.find(function(count){
                  return dataCenter === count._id.dataCenter && date === pad(count._id.month, 2) + '/' + pad(count._id.day, 2) + ' ' + pad(count._id.hour, 2);
                }) || { count: 0 }).count;
              });
            })
          };
        }
      );
    }
    $scope.getData = function(workerType, dataCenter) {
      $scope.loading = { counts: true, minions: true };
      $scope.dataCenters = [];
      getCounts();
      $scope.selected.workerType = workerType;
      getChart();
      $scope.selected.dataCenter = dataCenter;
      mmApi.query({state: $scope.selected.state, workerType: $scope.selected.workerType, dataCenter: $scope.selected.dataCenter}, function (minions) {
        $scope.minions = minions;
        $scope.loading.minions = false;
      });
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
    $scope.getRegion = function(dataCenter) {
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
    $scope.getData($scope.selected.workerType, $scope.selected.dataCenter);
  });
