import angular from 'angular';
import 'angular-mocks';
import {toolBar} from './toolBar';

describe('toolBar component', () => {
  beforeEach(() => {
    angular
      .module('toolBar', ['app/components/toolBar.html'])
      .component('toolBar', toolBar);
    angular.mock.module('toolBar');
  });

  it('should...', angular.mock.inject(($rootScope, $compile) => {
    const element = $compile('<toolBar></toolBar>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
