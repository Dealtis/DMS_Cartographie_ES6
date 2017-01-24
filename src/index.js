import angular from 'angular';
import Raven from 'raven-js';
import RavenPlugin from '../node_modules/raven-js/dist/plugins/angular.js';

// Components
import {
  App
} from './app/containers/App';
import {
  toolBar
} from './app/components/toolBar';
import {
  messageToolbar
} from './app/components/messageToolbar';
import {
  mapContainer
} from './app/components/mapcontainer';
import {
  asideContainer
} from './app/components/asidecontainer';
import {
  Api
} from './app/services/api';
import {
  VariablesShare
} from './app/services/variablesshare';
import {
  getPositionsFun
} from './app/functions/getPositionsFun';
import {
  getTrajetsFun
} from './app/functions/getTrajetsFun';
import {
  getAttentesFun
} from './app/functions/getAttentesFun';
import {
  getProgressFun
} from './app/functions/getProgressFun';
import {
  getPredictFun
} from './app/functions/getPredictFun';
import {
  diversFun
} from './app/functions/diversFun';

// html
import './app/containers/loading.html';

// Dependencies
import 'angular-ui-router';
import '@cgross/angular-busy';
import 'angular-animate';
import 'angular-messages';
import 'angular-cookies';
import 'angular-material';
import 'v-accordion';
import 'angular-filter';
import '../node_modules/angular-audio/app/angular.audio.js';
import '../node_modules/ngPrint/ngPrint.min.js';
import 'lodash';
import moment from 'moment';
// Dependencies google maps
import 'angular-google-maps';
import 'angular-simple-logger';

// Router
import routesConfig from './routes';

import './index.scss';
import '../node_modules/@cgross/angular-busy/dist/angular-busy.min.css';
import '../node_modules/ngPrint/ngPrint.css';

export const app = 'app';

angular
  .module(app, ['ui.router', 'ngMaterial', 'ngAnimate', 'ngMessages', 'ngAudio', 'ngPrint', 'ngCookies', 'angular.filter', 'cgBusy', 'vAccordion', 'uiGmapgoogle-maps'])
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
    libraries: 'weather,geometry,visualization,places'
  }))
  .component('app', App)
  .component('toolbar', toolBar)
  .component('messagetoolbar', messageToolbar)
  .component('mapcontainer', mapContainer)
  .component('asidecontainer', asideContainer)
  .service('api', Api)
  .service('VariablesShare', VariablesShare)
  .service('getPositionsFun', getPositionsFun)
  .service('getTrajetsFun', getTrajetsFun)
  .service('getAttentesFun', getAttentesFun)
  .service('getProgressFun', getProgressFun)
  .service('getPredictFun', getPredictFun)
  .service('diversFun', diversFun);

Raven
  .config('https://3210a38ae30c4a92b111ef6e6356460c@sentry.io/128043')
  .addPlugin(RavenPlugin)
  .install();
