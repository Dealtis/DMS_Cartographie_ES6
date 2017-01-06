import {
  config
} from '../constants/config.js';

class MapContainerController {
  constructor($scope, $log, uiGmapGoogleMapApi, api, MarkersFactory) {
    // Map config init
    $scope.markers = MarkersFactory.markers();
    $scope.markerLastPos = MarkersFactory.markerLastPos();
    $scope.map = config.mapOptions;
    $scope.clusterOptions = config.cluserOptions;
    $scope.clusterChauffeurOptions = config.clusterChauffeurOptions;
    uiGmapGoogleMapApi.then(maps => {
      $log.log(maps);
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

  getLastPos() {
    return "hello";
  }
}

export const mapContainer = {
  templateUrl: 'app/components/mapContainer.html',
  controller: MapContainerController
};
