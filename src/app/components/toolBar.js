class ToolBarController {
  constructor($scope, $log, $mdToast, api, uiGmapGoogleMapApi, getPositionsFun, $element, MarkersFactory) {
    $scope.dateCalendar = new Date();
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
    $scope.getPositionsLivraisons = (selectedChaufeurs, cbLivraison, dateCalendar) => {
      $scope.markers.push(getPositionsFun.getPositions(selectedChaufeurs, cbLivraison, dateCalendar));
    };
    uiGmapGoogleMapApi.then(maps => {
      // watcher selectedChauffeurs
      $scope.$watch('selectedChauffeurs', () => {
        MarkersFactory.cleanLastPos();
        if (angular.isDefined($scope.selectedChauffeurs) && $scope.selectedChauffeurs.length > 0) {
          // function get last pos de selectedChauffeurs and set marker
          $scope.selectedChauffeurs.forEach(chauffeur => {
            api.loadLastPos(chauffeur.SALCODE).then(dataGps => {
              if (dataGps.length > 0) {
                const dataGpsBrut = dataGps[0].DGPDERNIEREPOS.replace(",", ".").replace(",", ".");
                const posGps = dataGpsBrut.split(";");
                const heureGps = dataGps[0].DGPDERNIEREHEURE.split(" ");
                const addMarkerLastPos = {
                  id: chauffeur.SALCODE,
                  coords: {
                    latitude: posGps[0],
                    longitude: posGps[1]
                  },
                  options: {
                    icon: {
                      url: 'images/ICO/ico_truck.svg'
                    },
                    animation: maps.Animation.Hp,
                    labelContent: `${chauffeur.SALNOM}<br>${heureGps[1]}`,
                    labelAnchor: '20 40',
                    labelClass: "labels"
                  }
                };
                MarkersFactory.addmarkerLastPos(addMarkerLastPos);
              } else {
                const toast = $mdToast.simple()
                  .textContent(`Pas de données GPS pour ${chauffeur.SALNOM}`)
                  .action('X')
                  .highlightAction(true)
                  .position('top right');
                $mdToast.show(toast);
                $log.info(`Pas de données GPS pour ${chauffeur.SALCODE}`);
              }
            });
          });
        }
      });
    });
  }
}

export const toolBar = {
  templateUrl: 'app/components/toolBar.html',
  controller: ToolBarController
};
