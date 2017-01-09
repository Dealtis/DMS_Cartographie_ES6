const HTTP = new WeakMap();
const url = 'https://andsoft.jeantettransport.com/dms/api/';
export class Api {
  constructor($http) {
    HTTP.set(this, $http);
  }
  loadChauffeurs(idSoc) {
    return HTTP.get(this).get(`${url}dmsSalarieT?val=${idSoc}`).then(result => result.data);
  }
  loadSocposition(idSoc) {
    return HTTP.get(this).get(`${url}dmsCenter?val=${idSoc}`).then(result => result.data);
  }
  loadLastPos(chauffeur) {
    return HTTP.get(this).get(`${url}dmsLastPosGpsT?val=${chauffeur}`).then(result => result.data);
  }
  loadTrajet(chauffeur, date) {
    return HTTP.get(this).get(`${url}dmsTrajetT?val=${chauffeur}&date=${date}`).then(result => result.data);
  }
  loadPositions(chauffeur, date, typeMission) {
    if (typeMission === "liv") {
      return HTTP.get(this).get(`${url}dmsPosT?val=${chauffeur}&date=${date}`).then(result => result.data);
    }
    return HTTP.get(this).get(`${url}dmsRamT?val=${chauffeur}&date=${date}`).then(result => result.data);
  }
}
