import angular from 'angular';
import Raven from 'raven-js';
import RavenPlugin from '../node_modules/raven-js/dist/plugins/angular.js';

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
// Dependencies google maps
import 'angular-google-maps';
import 'angular-simple-logger';

// Config
import routesConfig from './routes';
import mapConfig from './mapConfig';
import momentConfig from './momentConfig';
import compilerConfig from './compilerConfig';
import httpConfig from './httpConfig';

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

// css
import './index.scss';
import '../node_modules/@cgross/angular-busy/dist/angular-busy.min.css';
import '../node_modules/ngPrint/ngPrint.css';

export const app = 'app';

angular
  .module(app, ['ui.router', 'ngMaterial', 'ngAnimate', 'angular.filter', 'ngMessages', 'ngCookies', 'ngAudio', 'ngRaven', 'angular.filter', 'cgBusy', 'vAccordion', 'uiGmapgoogle-maps'])
  .config(routesConfig)
  .config(compilerConfig)
  .config(momentConfig)
  .config(mapConfig)
  .config(httpConfig)
  .service('VariablesShare', VariablesShare)
  .component('app', App)
  .component('toolbar', toolBar)
  .component('messagetoolbar', messageToolbar)
  .component('mapcontainer', mapContainer)
  .component('asidecontainer', asideContainer)
  .service('api', Api)
  .service('getPositionsFun', getPositionsFun)
  .service('getTrajetsFun', getTrajetsFun)
  .service('getAttentesFun', getAttentesFun)
  .service('getProgressFun', getProgressFun)
  .service('getPredictFun', getPredictFun)
  .service('diversFun', diversFun);

Raven
  .config('https://3210a38ae30c4a92b111ef6e6356460c@sentry.io/128043', {
    release: '0e4fdef81448dcfa0e16ecc4433ff3997aa53572'
  })
  .addPlugin(RavenPlugin)
  .install();
