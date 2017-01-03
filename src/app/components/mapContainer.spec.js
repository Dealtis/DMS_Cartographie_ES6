import angular from 'angular';
import 'angular-mocks';
import {mapContainer} from './mapContainer';

describe('mapContainer component', () => {
  beforeEach(() => {
    angular
      .module('mapContainer', ['app/components/mapContainer.html'])
      .component('mapContainer', mapContainer);
    angular.mock.module('mapContainer');
  });

  it('should...', angular.mock.inject(($rootScope, $compile) => {
    const element = $compile('<></mapContainer>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
