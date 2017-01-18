import angular from 'angular';
import 'angular-mocks';
import {asideContainer} from './asideContainer';

describe('asideContainer component', () => {
  beforeEach(() => {
    angular
      .module('asideContainer', ['app/components/asideContainer.html'])
      .component('asideContainer', asideContainer);
    angular.mock.module('asideContainer');
  });

  it('should...', angular.mock.inject(($rootScope, $compile) => {
    const element = $compile('<asideContainer></asideContainer>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
