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
    });
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
    };
  });
