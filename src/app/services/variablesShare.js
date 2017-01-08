export class VariablesShare {
  constructor($log) {
    this.log = $log;
    const markers = [];
    const markerLastPos = [];
    this.markers = markers;
    this.markerLastPos = markerLastPos;
  }

  addmarkers(marker) {
    this.markers.push(marker);
    return this.markers;
  }
  addmarkerLastPos(marker) {
    this.markerLastPos.push(marker);
    return this.markerLastPos;
  }
  cleanLastPos() {
    this.markerLastPos.length = 0;
    return this.markerLastPos;
  }
}
