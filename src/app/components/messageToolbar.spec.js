import angular from 'angular';
import 'angular-mocks';
import {messageToolbar} from './messageToolbar';

describe('messageToolbar component', () => {
  beforeEach(() => {
    angular
      .module('messageToolbar', ['app/components/messageToolbar.html'])
      .component('messageToolbar', messageToolbar);
    angular.mock.module('messageToolbar');
  });

  it('should...', angular.mock.inject(($rootScope, $compile) => {
    const element = $compile('<messageToolbar></messageToolbar>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
