import angular from 'angular';

// Components
import {App} from './app/containers/App';
import {toolBar} from './app/components/toolBar';
import {mapContainer} from './app/components/mapcontainer';
import {Api} from './app/services/api';
import {getPositionsFun} from './app/functions/getPositionsFun';
// Dependencies
import 'angular-ui-router';
import 'angular-material';
import 'lodash';
import moment from 'moment';
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
  .config($compileProvider => {
    $compileProvider.preAssignBindingsEnabled(true);
  })
  .config($mdDateLocaleProvider => {
    $mdDateLocaleProvider.months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    $mdDateLocaleProvider.shortMonths = ['janv', 'févr', 'mars', 'avri', 'mai', 'juin', 'juill', 'août', 'sept', 'octo', 'nove', 'déce'];
    $mdDateLocaleProvider.days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    $mdDateLocaleProvider.shortDays = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
    $mdDateLocaleProvider.firstDayOfWeek = 1;
    $mdDateLocaleProvider.formatDate = date => {
      return moment(date).format('DD/MM/YYYY');
    };
    $mdDateLocaleProvider.weekNumberFormatter = weekNumber => {
      return `Semaine ${weekNumber}`;
    };

    $mdDateLocaleProvider.msgCalendar = 'Calendrier';
    $mdDateLocaleProvider.msgOpenCalendar = 'Ouvrir le calendrier';
  })
  .config(uiGmapGoogleMapApiProvider => uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyBraT3buBPTdDmqZ-Urn81aI8zWTfttA2Y',
    libraries: 'weather,geometry,visualization'
  }))
  .component('app', App)
  .component('toolbar', toolBar)
  .component('mapcontainer', mapContainer)
  .service('api', Api)
  .service('getPositionsFun', getPositionsFun);
