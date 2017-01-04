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
}
