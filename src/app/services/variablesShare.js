export class VariablesShare {
  constructor($log) {
    this.log = $log;
    const mapObject = {};
    const markers = [];
    const markerLastPos = [];
    const homeMarker = [];
    const windowOptions = {
      visible: false
    };
    const trajets = [];
    this.mapObject = mapObject;
    this.markers = markers;
    this.markerLastPos = markerLastPos;
    this.homeMarker = homeMarker;
    this.windowOptions = windowOptions;
    this.trajets = trajets;
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
}
