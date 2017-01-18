export class getTrajetsFun {
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

  getTrajets(selectedChaufeurs, dateCalendar) {
    return this.q((resolve, reject) => {
      try {
        this.uiGmapGoogleMapApi.then(maps => {
          selectedChaufeurs.forEach(chauffeur => {
            this.api.loadTrajet(chauffeur.SALCODE, this.diversFun.convertDate(dateCalendar))
              .then(dataTrajet => {
                const dataTrajetGps = dataTrajet[0].DGPPOSITION.split("|");
                const pathGpsArray = [];
                dataTrajetGps.forEach(line => {
                  const gpsFormat = (line.replace(",", ".").replace(",", ".")).split(";");
                  pathGpsArray.push({
                    latitude: Number(gpsFormat[0]),
                    longitude: Number(gpsFormat[1])
                  });
                });
                const polylines = {
                  id: Date.now,
                  path: pathGpsArray,
                  stroke: {
                    color: chauffeur.color,
                    weight: 2.5
                  },
                  editable: false,
                  draggable: false,
                  geodesic: true,
                  visible: true,
                  events: {
                    click: (marker, eventName, model) => {
                      this.log.log(marker);
                      this.log.log(eventName);
                      this.log.log(model);
                    }
                  },
                  icons: [{
                    icon: {
                      path: maps.SymbolPath.FORWARD_OPEN_ARROW
                    },
                    offset: '25px',
                    repeat: '200px'
                  }]
                };
                this.VariablesShare.addTrajet(polylines);
              });
          });
          this.timeout(() => {
            resolve("getPosition finish");
          }, 1000);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
