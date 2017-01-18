export class getProgressFun {
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
        selectedChaufeurs.forEach(chauffeur => {
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
              this.VariablesShare.addProgress(progressBar);
            });
        });
        resolve("getPosition finish");
      } catch (e) {
        reject(e);
      }
    });
  }
}
