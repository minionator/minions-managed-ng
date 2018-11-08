'use strict';

/**
 * @ngdoc overview
 * @name minionsManagedNgApp
 * @description
 * # minionsManagedNgApp
 *
 * Main module of the application.
 */
angular
  .module('minionsManagedNgApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'chart.js'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/minions/:workerType?/:dataCenter?', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/minion/:workerType?/:dataCenter?/:hostname?', {
        templateUrl: 'views/minion.html',
        controller: 'MinionCtrl',
        controllerAs: 'minion'
      })
      .when('/chart', {
        templateUrl: 'views/chart.html',
        controller: 'ChartCtrl',
        controllerAs: 'chart'
      })
      .otherwise({
        redirectTo: '/minions'
      });
  })
  .value(
    'personas',
    [
      'amazed',
      'bananas',
      'big',
      'cake',
      'crazy',
      'curious',
      'dancing',
      'duck',
      'girl',
      'golf',
      'happy',
      'hello',
      'kungfu',
      'reading',
      'sad',
      'shout',
      'shy',
      'superman'
    ]
  );

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}