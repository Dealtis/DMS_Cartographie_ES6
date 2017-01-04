class ToolBarController {
  constructor($scope, $log, api) {
    // Get Chauffeurs de la societe
    api.loadChauffeurs('73').then(chauffeurs => {
      $scope.chauffeurs = angular.fromJson(chauffeurs);
    });
  }
}

export const toolBar = {
  templateUrl: 'app/components/toolBar.html',
  controller: ToolBarController
};
