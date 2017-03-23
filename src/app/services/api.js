// const HTTP = new WeakMap();
const url = 'https://andsoft.jeantettransport.com/dms/api/';
export class Api {
  /* @ngInject */
  constructor($http, $log) {
    // HTTP.set(this, $http);
    this.http = $http;
    this.log = $log;
    //
    // $sce.trustAsResourceUrl('https://maps.googleapis.com/maps/api/geocode/json');
    // $sce.trustAsResourceUrl('https://maps.googleapis.com/maps/api/directions/json');
  }
  loadChauffeurs(idSoc, agence) {
    if (angular.isDefined(agence)) {
      this.log.log(`${url}dmssalarie?val=${idSoc}&agence=${agence}`);
      return this.http.get(`${url}dmssalarie?val=${idSoc}&agence=${agence}`).then(result => result.data);
    }
    this.log.log(`${url}dmssalarie?val=16&agence=`);
    return this.http.get(`${url}dmssalarie?val=${idSoc}&agence=`).then(result => result.data);
  }
  loadSocposition(idSoc) {
    this.log.log(`${url}dmsCenter?val=${idSoc}`);
    return this.http.get(`${url}dmsCenter?val=${idSoc}`).then(result => result.data);
  }
  loadLastPos(chauffeur) {
    this.log.log(`${url}dmsLastPosGpsT?val=${chauffeur}`);
    return this.http.get(`${url}dmsLastPosGpsT?val=${chauffeur}`).then(result => result.data);
  }
  loadTrajet(chauffeur, date) {
    this.log.log(`${url}dmsTrajetT?val=${chauffeur}&date=${date}`);
    return this.http.get(`${url}dmsTrajetT?val=${chauffeur}&date=${date}`).then(result => result.data);
  }
  loadPositions(chauffeur, date, typeMission) {
    if (typeMission === "liv") {
      this.log.log(`${url}dmsPosT?val=${chauffeur}&date=${date}`);
      return this.http.get(`${url}dmsPosT?val=${chauffeur}&date=${date}`).then(result => result.data);
    }
    this.log.log(`${url}dmsRamT?val=${chauffeur}&date=${date}`);
    return this.http.get(`${url}dmsRamT?val=${chauffeur}&date=${date}`).then(result => result.data);
  }
  loadMessages(socid, minute, type) {
    this.log.log(`${url}dmsMessage?val=${socid}&minute=${minute}&type=${type}`);
    return this.http.get(`${url}dmsMessage?val=${socid}&minute=${minute}&type=${type}`).then(result => result.data);
  }
  postMessages(data) {
    return this.http.post(`http://10.1.2.65/MVCDMS/api/message`, data).then(result => result.data);
  }
  loadProgress(chauffeur, date) {
    this.log.log(`${url}dmsGaugeChauffT?val=${chauffeur}&date=${date}`);
    return this.http.get(`${url}dmsGaugeChauffT?val=${chauffeur}&date=${date}`).then(result => result.data);
  }
  loadPredict(chauffeur) {
    this.log.log(`${url}dmsInfoPos?val=${chauffeur}`);
    return this.http.get(`${url}dmsInfoPos?val=${chauffeur}`).then(result => result.data);
  }
  getGeocode(nom, adr, cp, ville) {
    this.log.log(`https://maps.googleapis.com/maps/api/geocode/json?address=${nom.split(' ').join('+')},${adr.split(' ').join('+')},${cp},${ville.split(' ').join('+')}&key=AIzaSyBOeBriCeuw0BETvQRlKloB4KoooPYzu4g`);
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${nom.split(' ').join('+')},${adr.split(' ').join('+')},${cp},${ville.split(' ').join('+')}&key=AIzaSyBOeBriCeuw0BETvQRlKloB4KoooPYzu4g`).then(result => result.data);
  }
  getMatrix(origins, destinations) {
    return this.http.get(`${url}mapsDirections?origins=${origins}&destinations=${destinations}`).then(result => result.data);
  }
}
