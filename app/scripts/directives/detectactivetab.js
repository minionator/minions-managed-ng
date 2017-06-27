'use strict';

/**
 * @ngdoc directive
 * @name minionsManagedNgApp.directive:detectActiveTab
 * @description
 * # detectActiveTab
 */
angular.module('minionsManagedNgApp')
  .directive('detectActiveTab', function ($location) {
    return {
      link: function postLink(scope, element, attrs) {
        scope.$on("$routeChangeSuccess", function (event, current, previous) {
          var pathLevel = attrs.detectActiveTab || 1,
              pathToCheck = $location.path().split('/')[pathLevel] || "current $location.path doesn't reach this level",
              tabLink = attrs.href.split('/')[pathLevel] || "href doesn't include this level";
          if (pathToCheck === tabLink) {
            element.parent().addClass('active');
          } else {
            element.parent().removeClass('active');
          }
        });
      }
    };
  });