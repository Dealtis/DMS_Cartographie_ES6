class ToolBarController {
  constructor($scope, $log, api, getPositionsFun, $element) {
    $scope.clearSearchTerm = () => {
      $scope.searchTerm = '';
    };
    $element.find('input').on('keydown', ev => {
      ev.stopPropagation();
    });
    // Get Chauffeurs de la societe
    api.loadChauffeurs('73').then(chauffeurs => {
      $scope.chauffeurs = angular.fromJson(chauffeurs);
    });
    $scope.markers = [];
    $scope.getPositionsLivraisons = (selectedChaufeurs, cbLivraison, dateCalendar) => {
      $scope.markers.push(getPositionsFun.getPositions(selectedChaufeurs, cbLivraison, dateCalendar));
    };
  }
}

export const toolBar = {
  templateUrl: 'app/components/toolBar.html',
  controller: ToolBarController
};
