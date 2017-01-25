export class VariablesShare {
  constructor($log, $q, $timeout) {
    this.log = $log;
    this.q = $q;
    this.timeout = $timeout;
    const mapObject = {};
    const chauffeurs = [];
    const markers = [];
    const markersPredicts = [];
    const markerLastPos = [];
    const homeMarker = [];
    const windowOptions = {
      visible: false
    };
    const trajets = [];
    const trajetMatrix = [];
    const attentes = [];
    const Trafficshow = true;
    const messagesNonlu = [];
    const progressBars = [];
    this.mapObject = mapObject;
    this.chauffeurs = chauffeurs;
    this.markers = markers;
    this.markersPredicts = markersPredicts;
    this.markerLastPos = markerLastPos;
    this.homeMarker = homeMarker;
    this.windowOptions = windowOptions;
    this.trajets = trajets;
    this.trajetMatrix = trajetMatrix;
    this.attentes = attentes;
    this.Trafficshow = Trafficshow;
    this.messagesNonlu = messagesNonlu;
    this.progressBars = progressBars;

    // Promises
    const Promises = [];
    this.Promises = Promises;
  }
  setPromise(promise) {
    this.Promises.push(promise);
  }
  clearPromise() {
    this.Promises.length = 0;
  }
  addmarkers(marker) {
    this.markers.push(marker);
  }
  addPredict(predict) {
    this.markersPredicts.push(predict);
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
  cleanPredict() {
    this.markersPredicts.length = 0;
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
  addTrajetMatrix(trajet) {
    this.trajetMatrix.push(trajet);
  }
  cleanTrajetMatrix() {
    this.trajetMatrix.length = 0;
  }
  addAttentes(attentes) {
    attentes.forEach(attente => {
      this.attentes.push(attente);
    });
  }
  cleanAttentes() {
    this.attentes.length = 0;
  }
  cleanProgressBars() {
    this.progressBars.length = 0;
  }
  addMessage(message) {
    this.messagesNonlu.push(message);
  }
  addProgress(progressBar) {
    this.progressBars.push(progressBar);
  }
}
