import {
  config
} from '../constants/config.js';
import pleaseWait from '../../../node_modules/please-wait/build/please-wait.js';

class MapContainerController {
  /* @ngInject */
  constructor($scope, $log, $cookies, $document, $templateCache, uiGmapGoogleMapApi, api, VariablesShare) {
    // Loading

    const loadingScreen = pleaseWait.pleaseWait({
      logo: 'images/ico/ico_home.svg',
      backgroundColor: '#eeeeee',
      loadingHtml: "<div class='sk-cube-grid'><div class='sk-cube sk-cube1'></div><div class='sk-cube sk-cube2'></div><div class='sk-cube sk-cube3'></div><div class='sk-cube sk-cube4'></div><div class='sk-cube sk-cube5'></div><div class='sk-cube sk-cube6'></div><div class='sk-cube sk-cube7'></div><div class='sk-cube sk-cube8'></div><div class='sk-cube sk-cube9'></div></div>"
    });

    if (angular.isUndefined($cookies.get('SOCID'))) {
      pleaseWait.pleaseWait({
        logo: 'images/ico/ico_home.svg',
        backgroundColor: '#eeeeee',
        loadingHtml: "Merci de vous connecter à Andsoft"
      });
      throw new Error("Pas de socid");
    }

    // SEARCHBOX
    $scope.searchbox = {
      template: 'searchbox.tpl.html',
      events: {
        /*eslint-disable */
        places_changed: searchBox => {
          $scope.map.control.getGMap().panTo({
            lat: searchBox.getPlaces()[0].geometry.location.lat(),
            lng: searchBox.getPlaces()[0].geometry.location.lng()
          });
        }
        /*eslint-enable */
      }
    };

    // Map config init
    $scope.markers = VariablesShare.markers;
    $scope.markersPredicts = VariablesShare.markersPredicts;
    $scope.markerLastPos = VariablesShare.markerLastPos;
    $scope.Trajets = VariablesShare.trajets;
    $scope.TrajetMatrix = VariablesShare.trajetMatrix;
    $scope.attentes = VariablesShare.attentes;
    $scope.Trafficshow = VariablesShare.Trafficshow;
    $scope.map = config.mapOptions;
    $scope.windowOptions = VariablesShare.windowOptions;
    $scope.clusterOptions = config.cluserOptions;
    $scope.clusterPreOptions = config.cluserPreOptions;
    $scope.clusterChauffeurOptions = config.clusterChauffeurOptions;

    uiGmapGoogleMapApi.then(() => {
      // Get Position de la societe
      api.loadSocposition($cookies.get('SOCID')).then(posSociete => {
        const gpsPosSociete = posSociete[0].SOCGOOGLEMAP.split(',');
        const gpsSocLat = gpsPosSociete[0];
        const gpsSocLong = gpsPosSociete[1].split('|');
        VariablesShare.mapObject = $scope.map.control.getGMap();
        // Center map to Societe Position
        $scope.map.control.getGMap().panTo({
          lat: Number(gpsSocLat),
          lng: Number(gpsSocLong[0])
        });
        // Add home marker
        VariablesShare.homeMarker = {
          id: Date.now(),
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
        loadingScreen.finish();
      });
    });
  }
}

export const mapContainer = {
  template: require('./mapContainer.html'),
  controller: MapContainerController
};
