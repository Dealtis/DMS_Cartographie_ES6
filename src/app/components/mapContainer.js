import {
  config
} from '../constants/config.js';

class MapContainerController {
  constructor($scope, $log, uiGmapGoogleMapApi, api, VariablesShare) {
    // Map config init
    $scope.markers = VariablesShare.markers;
    $scope.markerLastPos = VariablesShare.markerLastPos;
    $scope.map = config.mapOptions;
    $scope.windowOptions = VariablesShare.windowOptions;
    $scope.clusterOptions = config.cluserOptions;
    $scope.clusterChauffeurOptions = config.clusterChauffeurOptions;
    uiGmapGoogleMapApi.then(maps => {
      $log.log(maps);
      // Get Position de la societe
      api.loadSocposition('73').then(posSociete => {
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
