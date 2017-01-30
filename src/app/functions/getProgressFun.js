export class getProgressFun {
  /* @ngInject */
  constructor($log, $q, api, diversFun, VariablesShare) {
    this.log = $log;
    this.q = $q;
    this.api = api;
    this.diversFun = diversFun;
    this.VariablesShare = VariablesShare;
  }

  getProgress(selectedChaufeurs, dateCalendar) {
    return this.q((resolve, reject) => {
      try {
        const promises = [];
        selectedChaufeurs.forEach(chauffeur => {
          const deferred = this.q.defer();
          // Get progress foreach chauffeur
          this.api.loadProgress(chauffeur.SALCODE, this.diversFun.convertDate(dateCalendar))
            .then(dataProgress => {
              const progressBar = {
                chauffeur: chauffeur.SALNOM,
                color: chauffeur.color,
                livTot: 0,
                ramTot: 0
              };
              dataProgress.forEach(progress => {
                if (progress.typeMission === "LIV") {
                  progressBar.liv = progress.nbFait;
                  progressBar.livTot = progress.nbPos;
                  progressBar.livPercent = (Number(progress.nbFait) * 100) / Number(progress.nbPos);
                } else {
                  progressBar.ram = progress.nbFait;
                  progressBar.ramTot = progress.nbPos;
                  progressBar.ramPercent = (Number(progress.nbFait) * 100) / Number(progress.nbPos);
                }
              });
              progressBar.positionsAll = [];
              if (progressBar.liv > 0) {
                this.api.loadPositions(chauffeur.SALCODE, this.diversFun.convertDate(dateCalendar), 'liv')
                  .then(dataPositions => {
                    progressBar.positionsLivraisons = [];
                    dataPositions.forEach(position => {
                      const heureSplit = position.DATESUIVI.split(" ");
                      if (position.CODEANO !== "FLASHAGE" && position.CODEANO !== "FLASHAGEIMP") {
                        const newLivraisons = {
                          id: position.ID,
                          num: position.NUM,
                          memo: position.MEMO,
                          codeano: position.CODEANO,
                          datesuivi: heureSplit[1],
                          nom: position.EXPNOM,
                          adressse: position.EXPADR,
                          cp: position.EXPVILCP,
                          ville: position.EXPVILLIB
                        };
                        progressBar.positionsLivraisons.push(newLivraisons);
                        progressBar.positionsAll.push(newLivraisons);
                      }
                    });
                  });
              }
              if (progressBar.ram > 0) {
                this.api.loadPositions(chauffeur.SALCODE, this.diversFun.convertDate(dateCalendar), 'ram')
                  .then(dataPositions => {
                    progressBar.positionsRamasses = [];
                    dataPositions.forEach(position => {
                      const heureSplit = position.DATESUIVI.split(" ");
                      if (position.CODEANO !== "FLASHAGE" && position.CODEANO !== "FLASHAGEIMP") {
                        const newLivraisons = {
                          id: position.ID,
                          num: position.NUM,
                          memo: position.MEMO,
                          codeano: position.CODEANO,
                          datesuivi: heureSplit[1],
                          nom: position.EXPNOM,
                          adressse: position.EXPADR,
                          cp: position.EXPVILCP,
                          ville: position.EXPVILLIB
                        };
                        progressBar.positionsRamasses.push(newLivraisons);
                        progressBar.positionsAll.push(newLivraisons);
                      }
                    });
                  });
              }
              this.VariablesShare.addProgress(progressBar);
              deferred.resolve();
            });
          promises.push(deferred.promise);
        });
        this.q.all(promises).then(() => {
          resolve("getProgress finish");
        }, response => {
          this.log.log(response);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
