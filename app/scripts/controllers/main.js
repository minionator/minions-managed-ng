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
    $scope.workerTypes = ['gecko-1-b-win2012', 'gecko-2-b-win2012', 'gecko-3-b-win2012', 'gecko-t-win7-32', 'gecko-t-win7-32-gpu', 'gecko-t-win10-64', 'gecko-t-win10-64-gpu'];
    $scope.dataCenters = ['euc1', 'use1', 'use2', 'usw1', 'usw2'];
    $scope.selected = {
      workerType: $scope.workerTypes[0],
      dataCenter: $scope.dataCenters[1]
    };
    function getCounts() {
      mmApi.counts(
        {state: 'alive'},
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
      $scope.loading = { counts: true, minions: { alive: true, idle: true, dead: true } };
      $scope.dataCenters = [];
      $scope.minions = {};
      getCounts();
      $scope.selected.workerType = workerType;
      getChart();
      $scope.selected.dataCenter = dataCenter;
      mmApi.query({state: 'alive', workerType: $scope.selected.workerType, dataCenter: $scope.selected.dataCenter}, function (minions) {
        $scope.minions.alive = minions;
        $scope.loading.minions.alive = false;
      });
      mmApi.query({state: 'dead', workerType: $scope.selected.workerType, dataCenter: $scope.selected.dataCenter}, function (minions) {
        $scope.minions.idle = minions.filter(function(minion){
          return !minion.tasks || minion.tasks.length === 0;
        });
        $scope.loading.minions.idle = false;
        $scope.minions.dead = minions.filter(function(minion){
          return minion.tasks && minion.tasks.length;
        });
        $scope.loading.minions.dead = false;
      });
    };
    function pluralise (value, period) {
      return ((value === 1) ? period : period + 's');
    }
    $scope.getUptime = function(start, end, precise, time) {
      if (start == null) {
        return 'unknown';
      }
      var endDate = end ? new Date(end) : new Date();
      var totalSeconds = (endDate - (new Date(start))) / 1000;
      var days = Math.floor(totalSeconds / 86400);
      var hours = Math.floor((totalSeconds - (days * 86400 )) / 3600)
      var minutes = Math.floor((totalSeconds - (days * 86400 ) - (hours * 3600 )) / 60)
      var seconds = Math.floor((totalSeconds - (days * 86400 ) - (hours * 3600 ) - (minutes * 60)))
      if (precise) {
        return (time) ? (hours + ':' + minutes + ':' + seconds) : (days + ' ' + hours + ':' + minutes + ':' + seconds);
      }
      if (days > 0) {
        return days + ' ' + pluralise(days, 'day');
      } else if (hours > 0) {
        return hours + ' ' + pluralise(hours, 'hour');
      } else if (minutes > 0) {
        return minutes + ' ' + pluralise(minutes, 'minute');
      }
      return seconds + pluralise(seconds, 'second');
    }
    $scope.getTtl = function(minion) {
      if (minion.spotRequest == null || minion.spotRequest.created == null || minion.tasks == null || minion.tasks.length < 1) {
        return 'unknown';
      }
      var start = new Date(minion.spotRequest.created);
      var end = new Date(minion.tasks[0].started);
      var totalSeconds = (end - start) / 1000;
      var days = Math.floor(totalSeconds / 86400);
      var hours = Math.floor((totalSeconds - (days * 86400 )) / 3600)
      var minutes = Math.floor((totalSeconds - (days * 86400 ) - (hours * 3600 )) / 60)
      var seconds = Math.floor((totalSeconds - (days * 86400 ) - (hours * 3600 ) - (minutes * 60)))
      return (hours + ':' + minutes + ':' + seconds);
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
