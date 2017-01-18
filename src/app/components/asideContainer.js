class AsideContainerController {
  constructor($scope, VariablesShare) {
    $scope.progressBars = VariablesShare.progressBars;
  }
}

export const asideContainer = {
  templateUrl: 'app/components/asideContainer.html',
  controller: AsideContainerController
};
