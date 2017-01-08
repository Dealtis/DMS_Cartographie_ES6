export class VariablesShare {
  constructor($log) {
    this.log = $log;
    const mapObject = {};
    const markers = [];
    const markerLastPos = [];
    const homeMarker = [];
    this.mapObject = mapObject;
    this.markers = markers;
    this.markerLastPos = markerLastPos;
    this.homeMarker = homeMarker;
  }

  addmarkers(marker) {
    this.markers.push(marker);
    return this.markers;
  }
  addmarkerLastPos(marker) {
    this.markerLastPos.push(marker);
    return this.markerLastPos;
  }
  cleanMarkers() {
    this.markers.length = 0;
    return this.markers;
  }
  cleanLastPos() {
    this.markerLastPos.length = 0;
    this.markerLastPos.push(this.homeMarker);
    return this.markerLastPos;
  }
}
