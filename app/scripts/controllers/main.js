'use strict';

/**
 * @ngdoc function
 * @name minionsManagedNgApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the minionsManagedNgApp
 */
angular.module('minionsManagedNgApp')
  .controller('MainCtrl', function ($scope, $location, $routeParams, mmApi) {
    $scope.path = $location.path();
    $scope.routeParams = $routeParams;
    $scope.workerTypes = ['gecko-1-b-win2012', 'gecko-2-b-win2012', 'gecko-3-b-win2012', 'gecko-t-win7-32', 'gecko-t-win7-32-gpu', 'gecko-t-win10-64', 'gecko-t-win10-64-gpu', 'gecko-t-win10-64-hw'];
    $scope.dataCenters = ($routeParams.workerType && ($routeParams.workerType.endsWith('-hw'))) ? ['mdc1', 'mdc2', 'mtv1', 'mtv2'] : ['use1', 'use2', 'usw1', 'usw2', 'euc1'];
    $scope.selected = {
      workerType: $routeParams.workerType || $scope.workerTypes[0],
      dataCenter: $routeParams.dataCenter || $scope.dataCenters[0]
    };
    function getCounts() {
      mmApi.counts(
        {state: 'alive'},
        function (counts) {
          //$scope.workerTypes = [];
          //$scope.dataCenters = [];
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
      mmApi.query({state: 'alive', workerType: $scope.selected.workerType, dataCenter: $scope.selected.dataCenter, limit: 1000}, function (minions) {
        $scope.minions.alive = minions;
        $scope.loading.minions.alive = false;
      });
      mmApi.query({state: 'dead', workerType: $scope.selected.workerType, dataCenter: $scope.selected.dataCenter, limit: 100}, function (minions) {
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
    $scope.getLogUrl = function(minion) {
      if (minion.dataCenter.startsWith('mdc') || minion.dataCenter.startsWith('mtv')) {
        switch (minion._id.slice(-7, -5)) {
          case '00': // gecko-t-win10-64-hw
            return 'https://papertrailapp.com/systems/t-w1064-ms-' + minion._id.slice(-3) + '.' + minion.dataCenter + '.mozilla.com/events';
          case '01': // gecko-t-win7-32-hw
            return 'https://papertrailapp.com/systems/t-w732-ms-' + minion._id.slice(-3) + '.' + minion.dataCenter + '.mozilla.com/events';
          case '02': // gecko-t-osx-1010
            return 'https://papertrailapp.com/systems/t-yosemite-r7-' + minion._id.slice(-3) + '.test.releng.' + minion.dataCenter + '.mozilla.com/events';
          case '03': // gecko-t-linux-talos
            return 'https://papertrailapp.com/systems/t-linux64-ms-' + minion._id.slice(-3) + '.test.releng.' + minion.dataCenter + '.mozilla.com/events';
          case '04': // gecko-t-win10-64-ux
            return 'https://papertrailapp.com/systems/t-w1064-ux-' + minion._id.slice(-3) + '.' + minion.dataCenter + '.mozilla.com/events';
          default:
            return null;
        }
      }
      return 'https://papertrailapp.com/systems/' + minion._id.replace('0000000', 'i-') + '.' + minion.workerType + '.' + minion.dataCenter + '.mozilla.com/events';
    };
    $scope.getHostname = function(minion) {
      if (minion.dataCenter.startsWith('mdc') || minion.dataCenter.startsWith('mtv')) {
        switch (minion._id.slice(-7, -5)) {
          case '00': // gecko-t-win10-64-hw
            return 't-w1064-ms-' + minion._id.slice(-3);
          case '01': // gecko-t-win7-32-hw
            return 't-w732-ms-' + minion._id.slice(-3);
          case '02': // gecko-t-osx-1010
            return 't-yosemite-r7-' + minion._id.slice(-3);
          case '03': // gecko-t-linux-talos
            return 't-linux64-ms-' + minion._id.slice(-3);
          case '04': // gecko-t-win10-64-ux
            return 't-w1064-ux-' + minion._id.slice(-3);
          default:
            return minion._id;
        }
      }
      return minion._id.replace('0000000', 'i-');
    };
    $scope.showBody = {
      alive: false,
      idle: false,
      dead: false
    }
    $scope.toggle = function(state) {
      $scope.showBody[state] = !$scope.showBody[state];
      $scope.minions[state].forEach(function(minion){
        minion.showbody = $scope.showBody[state];
      });
    };
    $scope.getData($scope.selected.workerType, $scope.selected.dataCenter);
  });
