export class getAttentesFun {
  constructor($log, $mdToast, uiGmapGoogleMapApi, api, diversFun, VariablesShare) {
    this.log = $log;
    this.mdToast = $mdToast;
    this.uiGmapGoogleMapApi = uiGmapGoogleMapApi;
    this.api = api;
    this.diversFun = diversFun;
    this.VariablesShare = VariablesShare;
  }

  getAttentes(selectedChaufeurs, dateCalendar) {
    this.uiGmapGoogleMapApi.then(() => {
      selectedChaufeurs.forEach(chauffeur => {
        this.api.loadTrajet(chauffeur.SALCODE, this.diversFun.convertDate(dateCalendar))
          .then(dataTrajet => {
            this.log.log(dataTrajet);
            const dataTrajetGps = dataTrajet[0].DGPPOSITION.split("|");
            const dataTrajetHeure = dataTrajet[0].DGPHEUREPOS.split("|");
            dataTrajetGps.forEach((line, index) => {
              const gpsFormat = (line.replace(",", ".").replace(",", ".")).split(";");
              const addAttente = {
                id: Date.now(),
                chauffeur: dataTrajet[0].DGPCOND,
                heure: dataTrajetHeure[index],
                coords: {
                  latitude: Number(gpsFormat[0]),
                  longitude: Number(gpsFormat[1])
                },
                options: {
                  icon: {
                    url: "images/ICO/ico_attente.svg"
                  }
                  // animation: maps.Animation.Hp,
                  // labelContent: heure[1],
                  // labelAnchor: '20 40',
                  // labelClass: "labels",
                  // labelStyle: {
                  //   'box-shadow': `2px 2px 2px ${chauffeur.color}`
                  // }
                },
                events: {
                  click: (marker, eventName, model) => {
                    model.show = !model.show;
                  }
                }
              };
              this.VariablesShare.addAttentes(addAttente);
            });
          });
      });
    });
  }
}
