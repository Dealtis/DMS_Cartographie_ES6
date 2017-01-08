import angular from 'angular';
import 'angular-mocks';
import VariablesShare from './variablesShare';

describe('VariablesShare service', () => {
  beforeEach(() => {
    angular
      .module('VariablesShare', [])
      .service('VariablesShare', VariablesShare);
    angular.mock.module('VariablesShare');
  });

  it('should', angular.mock.inject(VariablesShare => {
    expect(VariablesShare.getData()).toEqual(3);
  }));
});
