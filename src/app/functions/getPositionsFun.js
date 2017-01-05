export class getPositionsFun {
  constructor($log) {
    this.log = $log;
  }

  getPositions(selectedChaufeurs, cbLivraison, dateCalendar) {
    this.log.log(selectedChaufeurs);
    this.log.log(cbLivraison);
    this.log.log(dateCalendar);
    return selectedChaufeurs;
  }
}
