import {
  config
} from '../constants/config.js';

class MapContainerController {
  constructor($scope, $log, uiGmapGoogleMapApi, api) {
    // this.uiGmapGoogleMapApi = uiGmapGoogleMapApi;
    this.api = api;
    uiGmapGoogleMapApi.then(maps =>
      $log.log(maps),
      // Map config init
      $scope.map = config.mapOptions,
      $scope.clusterOptions = config.cluserOptions,
      $scope.clusterChauffeurOptions = config.clusterChauffeurOptions,
      // Get Chauffeurs de la societe
      api.loadChauffeurs('73').then(response =>
        $log.log(response.data))
      // Get Position de la societe
      // Get des messages en attentes
    );
  }
}

export const mapContainer = {
  templateUrl: 'app/components/mapContainer.html',
  controller: MapContainerController
};
