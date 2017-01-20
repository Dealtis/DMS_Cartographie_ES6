import {
  config
} from '../constants/config.js';

class ToolBarController {
  constructor($scope, $log, $document, $cookies, $mdToast, $mdDialog, api, uiGmapGoogleMapApi, getPositionsFun, getTrajetsFun, getAttentesFun, getProgressFun, $element, VariablesShare) {
    $scope.dateCalendar = new Date();
    $scope.clearSearchTerm = () => {
      $scope.searchTerm = '';
    };
    $scope.openMenu = ($mdOpenMenu, ev) => {
      $mdOpenMenu(ev);
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
    $scope.getPositions = getPositions;
    // Get Trajets
    $scope.getTrajets = getTrajets;
    // Get Attentes
    $scope.getAttentes = getAttentes;

    $scope.cancelSelected = () => {
      $scope.selectedChauffeurs.length = 0;
      VariablesShare.cleanLastPos();
      VariablesShare.cleanProgressBars();
      VariablesShare.cleanAttentes();
      VariablesShare.cleanTrajets();
    };
    let isMuted = "";
    if (angular.isDefined($cookies.get('isSoundMuted'))) {
      isMuted = $cookies.get('isSoundMuted');
      if (isMuted === "false") {
        $scope.urlSound = "images/ico/ico_speaker.png";
      } else {
        $scope.urlSound = "images/ico/ico_mute.png";
      }
    } else {
      $cookies.put('isSoundMuted', "false");
      $scope.urlSound = "images/ico/ico_speaker.png";
    }

    $scope.muteSound = () => {
      if (isMuted === "false") {
        $cookies.put('isSoundMuted', "true");
        $scope.urlSound = "images/ico/ico_mute.png";
        isMuted = "true";
      } else {
        $scope.urlSound = "images/ico/ico_speaker.png";
        $cookies.put('isSoundMuted', "false");
        isMuted = "false";
      }
    };

    uiGmapGoogleMapApi.then(maps => {
      // watcher selectedChauffeurs
      $scope.$watch('selectedChauffeurs', () => {
        VariablesShare.cleanLastPos();
        VariablesShare.cleanProgressBars();
        VariablesShare.cleanAttentes();
        VariablesShare.cleanTrajets();
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
          setProgressBar($scope.selectedChauffeurs, $scope.dateCalendar);
          // Condition d'affichage
          if ($scope.cbLivraison) {
            getPositions($scope.selectedChauffeurs, true, $scope.dateCalendar, 'liv');
          }
          if ($scope.cbRamasses) {
            getPositions($scope.selectedChauffeurs, true, $scope.dateCalendar, 'ram');
          }
          if ($scope.cbTrajet) {
            getTrajets($scope.selectedChauffeurs, true, $scope.dateCalendar);
          }
          if ($scope.cbAttentes) {
            getAttentes($scope.selectedChauffeurs, true, $scope.dateCalendar);
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

    function getPositions(selectedChaufeurs, checkbox, dateCalendar, typeMission) {
      if (checkbox) {
        VariablesShare.cleanMarkers();
        const getPositionPromise = getPositionsFun.getPositions(selectedChaufeurs, dateCalendar, typeMission);
        getPositionPromise.message = "Chargement des positions";
        VariablesShare.setPromise(getPositionPromise);
        getPositionPromise.then(() => {
          VariablesShare.clearPromise();
        }, err => {
          $log.error(err);
        });
      } else {
        VariablesShare.cleanMarkers();
      }
    }

    function getAttentes(selectedChaufeurs, checkbox, dateCalendar) {
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
    }

    function getTrajets(selectedChaufeurs, checkbox, dateCalendar) {
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
    }

    function setProgressBar(selectedChaufeurs, dateCalendar) {
      const getProgressBarPromise = getProgressFun.getProgress(selectedChaufeurs, dateCalendar);
      // getProgressBarPromise.message = "Chargement";
      // VariablesShare.setPromise(getProgressBarPromise);
      getProgressBarPromise.then(() => {
        // VariablesShare.clearPromise();
      }, err => {
        // if reject
        $log.error(err);
      });
    }
  }
}

export const toolBar = {
  templateUrl: 'app/components/toolBar.html',
  controller: ToolBarController
};
