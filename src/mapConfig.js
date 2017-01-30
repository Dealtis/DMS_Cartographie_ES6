export default mapConfig;

/** @ngInject */
function mapConfig(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyBraT3buBPTdDmqZ-Urn81aI8zWTfttA2Y',
    libraries: 'weather,geometry,visualization,places'
  });
}
