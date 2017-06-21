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
      'https://api.minions-managed.tk/minions/alive',
      {},
      {
        query: { isArray: true }
      }
    );
  });