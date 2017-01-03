const HTTP = new WeakMap();
const url = 'https://andsoft.jeantettransport.com/dms/api/';
export class Api {
  constructor($http) {
    HTTP.set(this, $http);
  }
  loadChauffeurs(idsoc) {
    return HTTP.get(this).get(`${url}dmsSalarieT?val=${idsoc}`);
  }
  loadPositionSociete(idsoc) {
    return HTTP.get(`${url}dmsCenter?val=' + ${idsoc})`);
  }
}
