'use strict';

/**
 * @ngdoc service
 * @name minionsManagedNgApp.mmApi
 * @description
 * # mmApi
 * Factory in the minionsManagedNgApp.
 */
angular.module('minionsManagedNgApp')
  .factory('mmApi', function ($resource) {
    return $resource(
      'http://ec2-52-90-242-185.compute-1.amazonaws.com/minions/alive',
      {},
      {
        query: { isArray: true }
      }
    );
  });