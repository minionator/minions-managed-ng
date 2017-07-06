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
    var api = 'https://api.minions-managed.tk/';

    return $resource(
      api,
      {
        state: '@_state',
        period: '@_period',
        workerType: '@_workerType',
        dataCenter: '@_dataCenter',
        limit: '@_limit'
      },
      {
        query: {
          url: api + 'minions/:state/:workerType/:dataCenter/:limit',
          isArray: true
        },
        counts: {
          url: api + 'minion/:state/count',
          method: 'GET',
          isArray: true
        },
        allHistory: {
          url: api + 'minion/:period/stats',
          method: 'GET',
          isArray: true
        },
        history: {
          url: api + 'minion/:workerType/:period/stats',
          method: 'GET',
          isArray: true
        }
      }
    );
  });