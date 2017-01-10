export class VariablesShare {
  constructor($log, $q, $timeout) {
    this.log = $log;
    this.q = $q;
    this.timeout = $timeout;
    const mapObject = {};
    const markers = [];
    const markerLastPos = [];
    const homeMarker = [];
    const windowOptions = {
      visible: false
    };
    const trajets = [];
    const attentes = [];
    this.mapObject = mapObject;
    this.markers = markers;
    this.markerLastPos = markerLastPos;
    this.homeMarker = homeMarker;
    this.windowOptions = windowOptions;
    this.trajets = trajets;
    this.attentes = attentes;
  }

  addmarkers(marker) {
    this.markers.push(marker);
  }
  addmarkerLastPos(marker) {
    this.markerLastPos.push(marker);
  }
  cleanMarkers() {
    this.markers.length = 0;
  }
  cleanLastPos() {
    this.markerLastPos.length = 0;
    this.markerLastPos.push(this.homeMarker);
  }
  addTrajet(trajet) {
    this.trajets.push(trajet);
  }
  cleanTrajets() {
    this.trajets.length = 0;
  }
  addAttentes(attente) {
    this.attentes.push(attente);
  }
  cleanAttentes() {
    this.attentes.length = 0;
  }
}
