import angular from 'angular';

// Components
import {App} from './app/containers/App';
import {toolBar} from './app/components/toolBar';
import {mapContainer} from './app/components/mapcontainer';
import {Api} from './app/services/api';
// Dependencies
import 'angular-ui-router';
import 'angular-material';
import 'lodash';
// Dependencies google maps
import 'angular-google-maps';
import 'angular-simple-logger';

// Router
import routesConfig from './routes';

import './index.scss';

export const app = 'app';

angular
  .module(app, ['ui.router', 'ngMaterial', 'uiGmapgoogle-maps'])
  .config(routesConfig)
  .config(uiGmapGoogleMapApiProvider => uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyBraT3buBPTdDmqZ-Urn81aI8zWTfttA2Y',
    libraries: 'weather,geometry,visualization'
  }))
  .component('app', App)
  .component('toolbar', toolBar)
  .component('mapcontainer', mapContainer)
  .service('api', Api);
