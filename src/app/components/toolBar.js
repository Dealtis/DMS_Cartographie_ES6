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

    $scope.adminMode = false;
    $scope.openMenu = ($mdOpenMenu, ev) => {
      $mdOpenMenu(ev);
    };

    $element.find('input').on('keydown', ev => {
      ev.stopPropagation();
    });

    // Get Chauffeurs de la societe
    let saveChaufeurs = [];
    VariablesShare.SocieteName = $cookies.get('VALDEF').split('|')[1].split('_')[0];
    VariablesShare.socID = $cookies.get('SOCID');
    // const v = "68|COM28_AF|COMALDIS|1|EUR|2|EURO|EURO|EURO|EURO|EURO|10|DEF|DEF|DEF|DEF|DEF|DEF|DEFAUT|DEFAULT|DEFECTO|DEFAUT|DEFAUT|10|1|FR|%2D1||%2FIMAGES%2FFLAG%2Fflags%5Fof%5FFrance%2Egif|";
    // VariablesShare.SocieteName = v.split('|')[1].split('_')[0];
    // VariablesShare.socID = 68;
    api.loadChauffeurs(VariablesShare.socID, VariablesShare.SocieteName).then(chauffeurs => {
      $scope.chauffeurs = angular.fromJson(chauffeurs);
      $scope.chauffeurs.forEach((chauffeur, index) => {
        chauffeur.color = config.chauffColor[index];
        saveChaufeurs.push(chauffeur);
        VariablesShare.addChauffeur(chauffeur);
      });

      /*eslint-disable */
      angular.element(document).ready(function() {
        if (angular.isDefined($document[0].querySelector('.gm-style'))) {
          $document[0].querySelector('.gm-style').querySelector('input').placeholder = "Entrez une adresse";
        }else {
          setTimeout(function () {
            $document[0].querySelector('.gm-style').querySelector('input').placeholder = "Entrez une adresse";
          }, 10000);
        }
      });
      /*eslint-enable */
    });
    // Get Positions
    $scope.getPositions = getPositions;
    // Get Trajets
    $scope.getTrajets = getTrajets;
    // Get Attentes
    $scope.getAttentes = getAttentes;
    // Get Predict
    $scope.getPredicts = getPredicts;
    // Get Predict
    $scope.getGpsChauffeurs = getGpsChauffeurs;
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

    // Mode admin
    $scope.cookiesSoc = [{
      socName: "Comaldis 28",
      socId: 68
    }, {
      socName: "Comaldis 60",
      socId: 69
    }, {
      socName: "Mj",
      socId: 3
    }, {
      socName: "Rodis",
      socId: 36
    }, {
      socName: "Jeantet",
      socId: 16
    }, {
      socName: "Stjo",
      socId: 55
    }, {
      socName: "Transaldis",
      socId: 61
    }, {
      socName: "Sdtl",
      socId: 29
    }, {
      socName: "Tradis",
      socId: 82
    }];

    $scope.setCookie = val => {
      VariablesShare.socID = val;
      if (val === 68) {
        VariablesShare.SocieteName = "COM28";
      }
      if (val === 69) {
        VariablesShare.SocieteName = "COM60";
      }
      saveChaufeurs = [];
      // reload chauffeurs
      api.loadChauffeurs(VariablesShare.socID, VariablesShare.SocieteName).then(chauffeurs => {
        $scope.chauffeurs = angular.fromJson(chauffeurs);
        $scope.chauffeurs.forEach((chauffeur, index) => {
          chauffeur.color = config.chauffColor[index];
          saveChaufeurs.push(chauffeur);
          VariablesShare.addChauffeur(chauffeur);
        });
      });

      // reload pos societe
      api.loadSocposition(VariablesShare.socID).then(posSociete => {
        const gpsPosSociete = posSociete[0].SOCGOOGLEMAP.split(',');
        const gpsSocLat = gpsPosSociete[0];
        const gpsSocLong = gpsPosSociete[1].split('|');

        // Center map to Societe Position
        VariablesShare.mapObject.panTo({
          lat: Number(gpsSocLat),
          lng: Number(gpsSocLong[0])
        });
        // Add home marker
        VariablesShare.homeMarker = {
          id: 10,
          coords: {
            latitude: gpsSocLat,
            longitude: gpsSocLong[0]
          },
          options: {
            icon: {
              url: 'images/ico/ico_home.svg'
            }
          }
        };
        VariablesShare.addmarkerLastPos(VariablesShare.homeMarker);
      });
      $scope.selectedChauffeurs.length = 0;
      whatToDo();
    };

    const adminKeys = [65, 68, 77, 73, 78];
    let keyIndex = 0;

    function keydown(e) {
      if (e.keyCode === adminKeys[keyIndex++]) {
        if (keyIndex === adminKeys.length) {
          keyIndex = 0;
          $log.log("admin");
          $scope.adminMode = true;
          $scope.$apply();
        }
      } else {
        keyIndex = 0;
      }
    }

    function stopListening() {
      $document.off('keydown', keydown);
    }

    // Start listening to key typing.
    $document.on('keydown', keydown);

    // Stop listening when scope is destroyed.
    $scope.$on('$destroy', stopListening);

    // end mode admin

    $scope.allSelected = () => {
      $scope.selectedChauffeurs.length = 0;
      saveChaufeurs.forEach(item => {
        $scope.selectedChauffeurs.push(item);
      });
      whatToDo();
    };

    // watcher selectedChauffeurs
    $scope.$watch('selectedChauffeurs', () => {
      whatToDo();
    });

    $scope.fitBounds = () => {
      VariablesShare.mapObject.setZoom(8);
    };

    $scope.refresh = () => {
      whatToDo();
      VariablesShare.addmarkerLastPos(VariablesShare.homeMarker);
    };

    function whatToDo() {
      VariablesShare.cleanLastPos();
      VariablesShare.cleanProgressBars();
      VariablesShare.cleanAttentes();
      VariablesShare.cleanTrajets();
      VariablesShare.cleanTrajetMatrix();
      VariablesShare.cleanPredict();
      VariablesShare.cleanLastPosOther();
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
      if ($scope.cbChauffeurs) {
        getGpsChauffeurs(true);
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

    function getGpsChauffeurs(checkbox) {
      if (checkbox) {
        getLastPos(saveChaufeurs, true);
      } else {
        VariablesShare.cleanLastPosOther();
      }
    }

    function getLastPos(chauffeurs, other) {
      uiGmapGoogleMapApi.then(() => {
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
                  icon: {},
                  // animation: maps.Animation.Hp,
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

              if (angular.isUndefined(other)) {
                addMarkerLastPos.options.labelContent = `${chauffeur.SALNOM}<br>${heureGps[1]}`;
                addMarkerLastPos.options.icon.url = 'images/ICO/ico_truck.svg';
                VariablesShare.addmarkerLastPos(addMarkerLastPos);
              } else {
                addMarkerLastPos.options.labelContent = `${chauffeur.SALNOM}`;
                addMarkerLastPos.options.icon.url = 'images/ICO/ico_truck_other.svg';
                VariablesShare.addmarkerLastPosOther(addMarkerLastPos);
              }
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
        VariablesShare.addmarkerLastPos(VariablesShare.homeMarker);
      });
    }

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
