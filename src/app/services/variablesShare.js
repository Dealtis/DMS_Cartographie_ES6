export class VariablesShare {
  constructor($log, $q, $timeout) {
    this.log = $log;
    this.q = $q;
    this.timeout = $timeout;
    const mapObject = {};
    const chauffeurs = [];
    const markers = [];
    const markerLastPos = [];
    const homeMarker = [];
    const windowOptions = {
      visible: false
    };
    const trajets = [];
    const attentes = [];
    const Trafficshow = true;
    const messagesNonlu = [];
    this.mapObject = mapObject;
    this.chauffeurs = chauffeurs;
    this.markers = markers;
    this.markerLastPos = markerLastPos;
    this.homeMarker = homeMarker;
    this.windowOptions = windowOptions;
    this.trajets = trajets;
    this.attentes = attentes;
    this.Trafficshow = Trafficshow;
    this.messagesNonlu = messagesNonlu;
  }

  addmarkers(marker) {
    this.markers.push(marker);
  }
  addmarkerLastPos(marker) {
    this.markerLastPos.push(marker);
  }
  addChauffeur(chauffeur) {
    this.chauffeurs.push(chauffeur);
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
  addAttentes(attentes) {
    attentes.forEach(attente => {
      this.attentes.push(attente);
    });
  }
  cleanAttentes() {
    this.attentes.length = 0;
  }
  addMessage(message) {
    this.messagesNonlu.push(message);
  }
}
