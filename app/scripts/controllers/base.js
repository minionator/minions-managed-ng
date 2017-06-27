'use strict';

/**
 * @ngdoc function
 * @name minionsManagedNgApp.controller:BaseCtrl
 * @description
 * # BaseCtrl
 * Controller of the minionsManagedNgApp
 */
angular.module('minionsManagedNgApp')
  .controller('BaseCtrl', function (personas) {
    this.persona = personas[Math.floor(Math.random() * personas.length)];
  });
