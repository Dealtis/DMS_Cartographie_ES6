// const HTTP = new WeakMap();
const url = 'https://andsoft.jeantettransport.com/dms/api/';
export class Api {
  constructor($http, $log) {
    // HTTP.set(this, $http);
    this.http = $http;
    this.log = $log;
  }
  loadChauffeurs(idSoc) {
    this.log.log(`${url}dmsSalarieT?val=${idSoc}`);
    return this.http.get(`${url}dmsSalarieT?val=${idSoc}`).then(result => result.data);
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
    this.log.log(`${url}dmsMessage?val=${socid}&minute=${minute}`);
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
    this.log.log(`https://maps.googleapis.com/maps/api/geocode/json?address=${nom.split(' ').join('+')},${adr.split(' ').join('+')},${cp},${ville.split(' ').join('+')}`);
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${nom.split(' ').join('+')},${adr.split(' ').join('+')},${cp},${ville.split(' ').join('+')}`).then(result => result.data);
  }
  getMatrix(origins, destinations) {
    this.log.log(`https://maps.googleapis.com/maps/api/directions/json?origin=${origins}&destination=${destinations}&key=AIzaSyBraT3buBPTdDmqZ-Urn81aI8zWTfttA2Y&language=fr`);
    return this.http.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${origins}&destination=${destinations}&key=AIzaSyBraT3buBPTdDmqZ-Urn81aI8zWTfttA2Y&language=fr`).then(result => result.data);
  }
}
