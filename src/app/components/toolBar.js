import {
  config
} from '../constants/config.js';

class ToolBarController {
  constructor($scope, $log, $document, $mdToast, api, uiGmapGoogleMapApi, getPositionsFun, getTrajetsFun, getAttentesFun, $element, VariablesShare) {
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
      $scope.chauffeurs.forEach((chauffeur, index) => {
        chauffeur.color = config.chauffColor[index];
        VariablesShare.addChauffeur(chauffeur);
      });
    });
    // Get Positions
    $scope.getPositions = (selectedChaufeurs, checkbox, dateCalendar, typeMission) => {
      if (checkbox) {
        VariablesShare.cleanMarkers();
        const getPositionPromise = getPositionsFun.getPositions(selectedChaufeurs, dateCalendar, typeMission);
        getPositionPromise.message = "Chargement des positions";
        VariablesShare.setPromise(getPositionPromise);
        getPositionPromise.then(() => {
          VariablesShare.clearPromise();
        }, err => {
          // if reject
          $log.error(err);
        });
      } else {
        VariablesShare.cleanMarkers();
      }
    };
    // Get Trajets
    $scope.getTrajets = (selectedChaufeurs, checkbox, dateCalendar) => {
      if (checkbox) {
        VariablesShare.cleanTrajets();
        const getTrajetPromise = getTrajetsFun.getTrajets(selectedChaufeurs, dateCalendar);
        getTrajetPromise.message = "Chargement des Trajets";
        VariablesShare.setPromise(getTrajetPromise);
        getTrajetPromise.then(() => {
          VariablesShare.clearPromise();
        }, err => {
          // if reject
          $log.error(err);
        });
      } else {
        VariablesShare.cleanTrajets();
      }
    };
    // Get Attentes
    $scope.getAttentes = (selectedChaufeurs, checkbox, dateCalendar) => {
      if (checkbox) {
        VariablesShare.cleanAttentes();
        const getAttentesPromise = getAttentesFun.getAttentes(selectedChaufeurs, dateCalendar);
        getAttentesPromise.message = "Chargement des Attentes";
        VariablesShare.setPromise(getAttentesPromise);
        getAttentesPromise.then(() => {
          VariablesShare.clearPromise();
        }, err => {
          // if reject
          $log.error(err);
        });
      } else {
        VariablesShare.cleanAttentes();
      }
    };
    $scope.cancelSelected = () => {
      $scope.selectedChauffeurs.length = 0;
    };

    uiGmapGoogleMapApi.then(maps => {
      // watcher selectedChauffeurs
      $scope.$watch('selectedChauffeurs', () => {
        VariablesShare.cleanLastPos();
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
                    labelClass: "labels",
                    labelStyle: {
                      'box-shadow': `2px 2px 2px ${chauffeur.color}`
                    }
                  },
                  events: {
                    click: (marker, eventName, model) => {
                      model.show = !model.show;
                    },
                    rightclick: () => {
                      $log.log(chauffeur.color);
                    }
                  }
                };
                VariablesShare.addmarkerLastPos(addMarkerLastPos);
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
          // get informations des jauges and display it
          // TODO:
          // Condition d'affichage
          if ($scope.cbLivraison) {
            // function getPositionsLivraisons
          }
          if ($scope.cbRamasses) {
            // function getPositionsRamasses
          }
          if ($scope.cbTrajet) {
            // function Trajet
          }
          if ($scope.cbChauffeurs && !$scope.cbLivraison && !$scope.cbRamasses && !$scope.cbTrajet) {
            // function afficher les positions gps des autres chauffeurs
          }
        }
      });
      $scope.fitBounds = () => {
        VariablesShare.mapObject.setZoom(8);
      };
    });
  }
}

export const toolBar = {
  templateUrl: 'app/components/toolBar.html',
  controller: ToolBarController
};
