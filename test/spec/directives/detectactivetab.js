'use strict';

describe('Directive: detectActiveTab', function () {

  // load the directive's module
  beforeEach(module('minionsManagedNgApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<detect-active-tab></detect-active-tab>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the detectActiveTab directive');
  }));
});
