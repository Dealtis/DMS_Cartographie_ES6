import angular from 'angular';
import 'angular-mocks';
import Api from './api';

describe('Api service', () => {
  beforeEach(() => {
    angular
      .module('Api', [])
      .service('Api', Api);
    angular.mock.module('Api');
  });

  it('should', angular.mock.inject(Api => {
    expect(Api.getData()).toEqual(3);
  }));
});
