'use strict';

/**
 * @ngdoc function
 * @name minionsManagedNgApp.controller:ChartCtrl
 * @description
 * # ChartCtrl
 * Controller of the minionsManagedNgApp
 */
angular.module('minionsManagedNgApp')
  .controller('ChartCtrl', function ($scope, mmApi) {
    function pad(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    mmApi.history(
      {period: 'day'},
      function (counts) {
        var dates = Array.from(new Set(counts.map(function(count){return count._id.year + '-' + pad(count._id.month, 2) + '-' + pad(count._id.day, 2);})));
        dates.sort();
        var workerTypes = Array.from(new Set(counts.map(function(count){return count._id.workerType;})));
        workerTypes.sort();
        $scope.chart = {
          labels: dates,
          series: workerTypes,
          data: workerTypes.map(function(workerType){
            return dates.map(function(date){
              return (counts.find(function(count){
                return workerType === count._id.workerType && date === count._id.year + '-' + pad(count._id.month, 2) + '-' + pad(count._id.day, 2);
              }) || { count: 0 }).count;
            });
          })
        };
      }
    );
  });
