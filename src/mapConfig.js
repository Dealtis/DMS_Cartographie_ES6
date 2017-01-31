export default mapConfig;

/** @ngInject */
function mapConfig(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyBOeBriCeuw0BETvQRlKloB4KoooPYzu4g',
    libraries: 'weather,geometry,visualization,places'
  });
}
