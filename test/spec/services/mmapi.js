'use strict';

describe('Service: mmApi', function () {

  // load the service's module
  beforeEach(module('minionsManagedNgApp'));

  // instantiate service
  var mmApi;
  beforeEach(inject(function (_mmApi_) {
    mmApi = _mmApi_;
  }));

  it('should do something', function () {
    expect(!!mmApi).toBe(true);
  });

});
