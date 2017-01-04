class ToolBarController {
  constructor($scope, $log, api, $element) {
    $scope.clearSearchTerm = () => {
      $scope.searchTerm = '';
    };
    // The md-select directive eats keydown events for some quick select
    // logic. Since we have a search input here, we don't need that logic.
    $element.find('input').on('keydown', ev => {
      ev.stopPropagation();
    });
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
