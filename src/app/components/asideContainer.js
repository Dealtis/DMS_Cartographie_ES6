class AsideContainerController {
  /* @ngInject */
  constructor($scope, VariablesShare) {
    $scope.progressBars = VariablesShare.progressBars;
  }
}

export const asideContainer = {
  template: require('./asideContainer.html'),
  controller: AsideContainerController
};
