import {
  config
} from '../constants/config.js';

import Raven from 'raven-js';
class ToolBarController {
  /* @ngInject */
  constructor($scope, $log, $document, $interval, $timeout, $cookies, $mdToast, $mdDialog, api, uiGmapGoogleMapApi, getPositionsFun, getTrajetsFun, getAttentesFun, getProgressFun, getPredictFun, $element, VariablesShare) {
    $scope.dateCalendar = new Date();
    $scope.selectedChauffeurs = [];
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
    const saveChaufeurs = [];
    api.loadChauffeurs($cookies.get('SOCID')).then(chauffeurs => {
      $scope.chauffeurs = angular.fromJson(chauffeurs);
      $scope.chauffeurs.forEach((chauffeur, index) => {
        chauffeur.color = config.chauffColor[index];
        saveChaufeurs.push(chauffeur);
        VariablesShare.addChauffeur(chauffeur);
      });
    });
    // Get Positions
    $scope.getPositions = getPositions;
    // Get Trajets
    $scope.getTrajets = getTrajets;
    // Get Attentes
    $scope.getAttentes = getAttentes;
    // Get Predict
    $scope.getPredicts = getPredicts;
    // Reload auto
    $scope.reloadAuto = reloadAuto;

    // See Raven.showReportDialog();
    $scope.reportDialog = () => {
      try {
        throw new Error("rapport de bug utilisateur");
      } catch (err) {
        Raven.captureException(err);
        Raven.showReportDialog();
      }
    };

    $scope.cancelSelected = () => {
      $scope.selectedChauffeurs.length = 0;
      VariablesShare.cleanLastPos();
      VariablesShare.cleanProgressBars();
      VariablesShare.cleanAttentes();
      VariablesShare.cleanTrajets();
      VariablesShare.cleanTrajetMatrix();
      VariablesShare.cleanPredict();
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

    // // PRINT
    // $scope.print = () => {
    //   printElement($document[0].getElementById('printThis'));
    //   const modThis = $document[0].querySelector("#printSection .modifyMe");
    //   modThis.appendChild($document[0].createTextNode(" new"));
    //   $window.print();
    // };

    $scope.allSelected = () => {
      saveChaufeurs.forEach(item => {
        $scope.selectedChauffeurs.push(item);
      });
      if (angular.isDefined($scope.selectedChauffeurs) && $scope.selectedChauffeurs.length > 0) {
        // function get last pos de selectedChauffeurs and set marker
        getLastPos($scope.selectedChauffeurs);
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
        if ($scope.cbPredict) {
          getPredicts($scope.selectedChauffeurs, true);
        }
        if ($scope.cbChauffeurs && !$scope.cbLivraison && !$scope.cbRamasses && !$scope.cbTrajet) {
          // function afficher les positions gps des autres chauffeurs
        }
      }
    };

    // watcher selectedChauffeurs
    $scope.$watch('selectedChauffeurs', () => {
      whatToDo();
    });

    $scope.fitBounds = () => {
      VariablesShare.mapObject.setZoom(8);
    };

    function whatToDo() {
      VariablesShare.cleanLastPos();
      VariablesShare.cleanProgressBars();
      VariablesShare.cleanAttentes();
      VariablesShare.cleanTrajets();
      VariablesShare.cleanTrajetMatrix();
      VariablesShare.cleanPredict();
      if (angular.isDefined($scope.selectedChauffeurs) && $scope.selectedChauffeurs.length > 0) {
        // function get last pos de selectedChauffeurs and set marker
        getLastPos($scope.selectedChauffeurs);
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
        if ($scope.cbPredict) {
          getPredicts($scope.selectedChauffeurs, true);
        }
        if ($scope.cbChauffeurs && !$scope.cbLivraison && !$scope.cbRamasses && !$scope.cbTrajet) {
          // function afficher les positions gps des autres chauffeurs
        }
      }
    }

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

    function getLastPos(chauffeurs) {
      uiGmapGoogleMapApi.then(maps => {
        chauffeurs.forEach(chauffeur => {
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
      });
    }

    // function printElement(elem) {
    //   const domClone = elem.cloneNode(true);
    //   let printSection = $document[0].getElementById('printSection');
    //   $log.log(printSection);
    //   if (!printSection) {
    //     printSection = $document[0].createElement("div");
    //     $log.log(printSection);
    //     printSection.id = "printSection";
    //     $document[0].body.appendChild(printSection);
    //   }
    //   $log.log(printSection);
    //   printSection.innerHTML = "";
    //   printSection.appendChild(domClone);
    // }

    function reloadAuto(sw1) {
      if (sw1) {
        $scope.interval = $interval(() => {
          $scope.progressReload = 0;
          whatToDo();
        }, 120000);
        $scope.intervalProgress = $interval(() => {
          $scope.progressReload += 1;
        }, 1200);
      } else {
        $log.log(`Interval stop`);
        $interval.cancel($scope.interval);
        $interval.cancel($scope.intervalProgress);
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

    function getPredicts(selectedChaufeurs, checkbox) {
      if (checkbox) {
        VariablesShare.cleanPredict();
        const getPredictPromise = getPredictFun.getPredict(selectedChaufeurs);
        getPredictPromise.message = "Chargement des Prédictions";
        VariablesShare.setPromise(getPredictPromise);
        getPredictPromise.then(() => {
          VariablesShare.clearPromise();
        }, err => {
          // if reject
          $log.error(err);
        });
      } else {
        VariablesShare.cleanPredict();
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
  template: require('./toolBar.html'),
  controller: ToolBarController
};
