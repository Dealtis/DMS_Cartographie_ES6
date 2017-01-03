import {
  config
} from '../constants/config.js';

class MapContainerController {
  constructor($scope, $log, uiGmapGoogleMapApi, api) {
    // Map config init
    $scope.map = config.mapOptions;
    $scope.clusterOptions = config.cluserOptions;
    $scope.clusterChauffeurOptions = config.clusterChauffeurOptions;
    uiGmapGoogleMapApi.then(maps => {
      $log.log(maps);
      // Get Chauffeurs de la societe
      api.loadChauffeurs('73').then(chauffeurs => {
        $scope.chauffeurs = angular.fromJson(chauffeurs);
        $log.log($scope.chauffeurs);
      });
      // Get Position de la societe
      // Get des messages en attentes
    });
  }
}

export const mapContainer = {
  templateUrl: 'app/components/mapContainer.html',
  controller: MapContainerController
};
