export class getPredictFun {
  constructor($log, $q, $timeout, $mdToast, uiGmapGoogleMapApi, api, diversFun, VariablesShare) {
    this.log = $log;
    this.q = $q;
    this.timeout = $timeout;
    this.mdToast = $mdToast;
    this.uiGmapGoogleMapApi = uiGmapGoogleMapApi;
    this.api = api;
    this.diversFun = diversFun;
    this.VariablesShare = VariablesShare;
  }

  static getGeocode(nom, adr, cp, ville) {
    this.api.getGeocode(nom, adr, cp, ville)
      .then(response => {
        this.log.log(response);
      });
  }

  getPredict(selectedChaufeurs) {
    return this.q((resolve, reject) => {
      try {
        this.uiGmapGoogleMapApi.then(() => {
          const promises = [];
          selectedChaufeurs.forEach(chauffeur => {
            const deferred = this.q.defer();
            this.api.loadPredict(chauffeur.NOMANDSOFT)
              .then(dataPredict => {
                const schProgressbar = this.VariablesShare.progressBars.find(progressBar => {
                  return progressBar.chauffeur === chauffeur.SALNOM;
                });
                this.log.log(dataPredict);
                dataPredict.forEach(item => {
                  if (item.OTPOTSNUM !== "") {
                    const schPos = schProgressbar.positionsAll.find(pBar => {
                      return item.OTPOTSNUM === pBar.num;
                    });
                    if (angular.isUndefined(schPos)) {
                      if (item.OTPTRSCODE === "LIV") {
                        this.getGeocode(item.OTPARRNOM, item.OTPARRADR1, item.OTPARRUSRVILCP, item.OTPARRUSRVILLIB);
                      } else {
                        this.getGeocode(item.OTPDEPNOM, item.OTPDEPADR1, item.OTPDEPUSRVILCP, item.OTPDEPUSRVILLIB);
                      }
                    }
                  }
                });
                deferred.resolve(dataPredict);
              });
            promises.push(deferred.promise);
          });

          this.q.all(promises).then(() => {
            resolve("getPredict finish");
          }, response => {
            this.log.log(response);
          });
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
