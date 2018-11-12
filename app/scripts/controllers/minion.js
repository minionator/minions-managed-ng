'use strict';

/**
 * @ngdoc function
 * @name minionsManagedNgApp.controller:MinionCtrl
 * @description
 * # MinionCtrl
 * Controller of the minionsManagedNgApp
 */
angular.module('minionsManagedNgApp')
  .controller('MinionCtrl', function ($scope, $location, $routeParams, mmApi) {
    var unmappedWorkerType = {
      code: '09'
    };
    var workerTypeMap = {
      'gecko-t-win10-64-hw': {
        code: '00',
        name: 't-w1064-ms-'
      },
      'gecko-t-win7-32-hw': {
        code: '01',
        name: 't-w732-ms-'
      },
      'gecko-t-osx-1010': {
        code: '02',
        name: 't-yosemite-r7-'
      },
      'gecko-t-linux-talos': {
        code: '03',
        name: 't-linux64-ms-'
      },
      'gecko-t-win10-64-ux': {
        code: '04',
        name: 't-w1064-ms-'
      }
    };
    var id = ($routeParams.hostname.startsWith('i-'))
      ? pad($routeParams.hostname.slice(2), 24)
      : ($routeParams.hostname.startsWith('t-'))
        ? pad((workerTypeMap[$routeParams.workerType] || unmappedWorkerType).code + '00' + $routeParams.hostname.slice(-3), 24)
        : {};
    mmApi.get({id: id}, function (minion) {
      $scope.minion = minion;
      var events = [];
      Array.prototype.push.apply(events, minion.jobs.map(function(e) { e.eventType = 'job'; return e; }));
      Array.prototype.push.apply(events, minion.tasks.map(function(e) { e.eventType = 'task'; return e; }));
      Array.prototype.push.apply(events, minion.restarts.map(function(e) { e.started = e.time; e.eventType = 'restart'; return e; }));
      $scope.events = events;
      $scope.dates = Array.from(new Set(events.map(function(e) { return e.started.substring(0, 10); })));
      $scope.dates.sort();
      $scope.showbody = {};
      $scope.showbody[$scope.dates[$scope.dates.length-1]] = true;
    });
    function pluralise (value, period) {
      return ((value === 1) ? period : period + 's');
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
    $scope.getQuerystring = function(event) {
      var querystring = 'time=' + (new Date(event.started).getTime());
      if (event.eventType === 'job') {
        querystring += '&q=program%3A' + event.name.replace('/', '%20');
      } else if (event.eventType === 'task') {
        querystring += '&q=program%3Ageneric-worker%20' + event.id;
      } else if (event.eventType === 'restart') {
        querystring += '&q=program%3A(user32 OR sudo)';
      }
      return querystring;
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
      if (minion.dataCenter && (minion.dataCenter.startsWith('mdc') || minion.dataCenter.startsWith('mtv'))) {
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
      return (minion._id)
        ? minion._id.replace('0000000', 'i-')
        : undefined;
    };
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
      return seconds + ' ' + pluralise(seconds, 'second');
    };
    $scope.dateFilter = function(date) {
      return function(event) {
        return event.started.startsWith(date);
      };
    };
  });
