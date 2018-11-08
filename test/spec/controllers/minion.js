'use strict';

describe('Controller: MinionCtrl', function () {

  // load the controller's module
  beforeEach(module('minionsManagedNgApp'));

  var MinionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MinionCtrl = $controller('MinionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MinionCtrl.awesomeThings.length).toBe(3);
  });
});
