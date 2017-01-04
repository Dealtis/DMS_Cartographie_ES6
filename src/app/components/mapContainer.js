import {
  config
} from '../constants/config.js';

class MapContainerController {
  constructor($scope, $log, uiGmapGoogleMapApi, api) {
    // Map config init
    $scope.map = config.mapOptions;
    $scope.clusterOptions = config.cluserOptions;
    $scope.clusterChauffeurOptions = config.clusterChauffeurOptions;
    uiGmapGoogleMapApi.then(() => {
      // Get Position de la societe
      api.loadSocposition('73').then(posSociete => {
        const gpsPosSociete = posSociete[0].SOCGOOGLEMAP.split(',');
        const gpsSocLat = gpsPosSociete[0];
        const gpsSocLong = gpsPosSociete[1].split('|');
        // Center map to Societe Position
        $scope.map.control.getGMap().panTo({
          lat: Number(gpsSocLat),
          lng: Number(gpsSocLong[0])
        });
        // Add home marker
        $scope.map.homeMarker = {
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
        // Get des messages en attentes
        // TODO: Get des messages en attentes
      });
    });
  }
}

export const mapContainer = {
  templateUrl: 'app/components/mapContainer.html',
  controller: MapContainerController
};
