export class getPositionsFun {
  constructor($log) {
    this.log = $log;
  }

  getPositions(selectedChaufeurs, cbLivraison, dateCalendar) {
    this.log.log(cbLivraison);
    this.log.log(dateCalendar);
    // let markers = [];
    // Get marker des differents chauffeurs select
    selectedChaufeurs.forEach(chauffeur => {
      this.log.log(chauffeur);
    });
    return selectedChaufeurs;
  }
}
