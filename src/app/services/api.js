const HTTP = new WeakMap();
const url = 'https://andsoft.jeantettransport.com/dms/api/';
export class Api {
  constructor($http, $log) {
    HTTP.set(this, $http);
    this.log = $log;
  }
  loadChauffeurs(idSoc) {
    this.log.log(`${url}dmsSalarieT?val=${idSoc}`);
    return HTTP.get(this).get(`${url}dmsSalarieT?val=${idSoc}`).then(result => result.data);
  }
  loadSocposition(idSoc) {
    this.log.log(`${url}dmsCenter?val=${idSoc}`);
    return HTTP.get(this).get(`${url}dmsCenter?val=${idSoc}`).then(result => result.data);
  }
  loadLastPos(chauffeur) {
    this.log.log(`${url}dmsLastPosGpsT?val=${chauffeur}`);
    return HTTP.get(this).get(`${url}dmsLastPosGpsT?val=${chauffeur}`).then(result => result.data);
  }
  loadTrajet(chauffeur, date) {
    this.log.log(`${url}dmsTrajetT?val=${chauffeur}&date=${date}`);
    return HTTP.get(this).get(`${url}dmsTrajetT?val=${chauffeur}&date=${date}`).then(result => result.data);
  }
  loadPositions(chauffeur, date, typeMission) {
    if (typeMission === "liv") {
      this.log.log(`${url}dmsPosT?val=${chauffeur}&date=${date}`);
      return HTTP.get(this).get(`${url}dmsPosT?val=${chauffeur}&date=${date}`).then(result => result.data);
    }

    this.log.log(`${url}dmsRamT?val=${chauffeur}&date=${date}`);
    return HTTP.get(this).get(`${url}dmsRamT?val=${chauffeur}&date=${date}`).then(result => result.data);
  }
  loadMessages(socid, minute) {
    this.log.log(`${url}dmsMessage?val=${socid}&minute=${minute}`);
    return HTTP.get(this).get(`${url}dmsMessage?val=${socid}&minute=${minute}`).then(result => result.data);
  }
  loadProgress(chauffeur, date) {
    this.log.log(`${url}dmsGaugeChauffT?val=${chauffeur}&date=${date}`);
    return HTTP.get(this).get(`${url}dmsGaugeChauffT?val=${chauffeur}&date=${date}`).then(result => result.data);
  }
  loadPredict(chauffeur) {
    this.log.log(`${url}dmsInfoPos?val=${chauffeur}`);
    return HTTP.get(this).get(`${url}dmsInfoPos?val=${chauffeur}`).then(result => result.data);
  }
  getGeocode(nom, adr, cp, ville) {
    this.log.log(`https://maps.googleapis.com/maps/api/geocode/json?address=${nom.split(' ').join('+')},${adr.split(' ').join('+')},${cp},${ville.split(' ').join('+')}`);
    return HTTP.get(this).get(`https://maps.googleapis.com/maps/api/geocode/json?address=${nom.split(' ').join('+')},${adr.split(' ').join('+')},${cp},${ville.split(' ').join('+')}`).then(result => result.data);
  }
}
