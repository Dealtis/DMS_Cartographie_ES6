export class getAttentesFun {
  /* @ngInject */
  constructor($log, $timeout, $q, $mdToast, uiGmapGoogleMapApi, api, diversFun, VariablesShare) {
    this.log = $log;
    this.timeout = $timeout;
    this.q = $q;
    this.mdToast = $mdToast;
    this.uiGmapGoogleMapApi = uiGmapGoogleMapApi;
    this.api = api;
    this.diversFun = diversFun;
    this.VariablesShare = VariablesShare;
  }

  getAttentes(selectedChaufeurs, dateCalendar) {
    return this.q((resolve, reject) => {
      try {
        this.uiGmapGoogleMapApi.then(maps => {
          const promises = [];
          selectedChaufeurs.forEach(chauffeur => {
            const deferred = this.q.defer();
            this.api.loadTrajet(chauffeur.SALCODE, this.diversFun.convertDate(dateCalendar))
              .then(dataTrajet => {
                const dataTrajetGps = dataTrajet[0].DGPPOSITION.split("|");
                const dataTrajetHeure = dataTrajet[0].DGPHEUREPOS.split("|");
                let prevObjectAttente = {
                  id: Math.floor((Math.random() * 9999999) + 1),
                  chauffeur: dataTrajet[0].DGPCOND,
                  coords: {
                    latitude: 0,
                    longitude: 0
                  },
                  options: {
                    icon: {
                      url: "images/ICO/ico_attente.svg"
                    },
                    animation: maps.Animation.Hp,
                    labelContent: "",
                    labelAnchor: '20 40',
                    labelClass: "labels",
                    labelStyle: {
                      'box-shadow': `2px 2px 2px ${chauffeur.color}`
                    }
                  }
                };
                let inAttenteLoop = false;
                let origineHeureTemp = "";
                const attenteArray = [];
                dataTrajetGps.forEach((line, index) => {
                  const gpsFormat = (line.replace(",", ".").replace(",", ".")).split(";");
                  // si la distance avec prevObjectAttente et currentObject est < à 150 mètres
                  if (this.diversFun.getDistanceFromLatLonInKm(prevObjectAttente.coords.latitude, prevObjectAttente.coords.longitude, Number(gpsFormat[0]), Number(gpsFormat[1])) < 0.15 || index === 0) {
                    if (index === 0) {
                      prevObjectAttente = {
                        id: Math.floor((Math.random() * 9999999) + 1),
                        chauffeur: dataTrajet[0].DGPCOND,
                        origineHeure: dataTrajetHeure[index],
                        endHeure: dataTrajetHeure[index],
                        coords: {
                          latitude: Number(gpsFormat[0]),
                          longitude: Number(gpsFormat[1])
                        },
                        options: {
                          icon: {
                            url: "images/ICO/ico_attente.svg"
                          },
                          animation: maps.Animation.Hp,
                          labelAnchor: '20 40',
                          labelClass: "labels",
                          labelStyle: {
                            'box-shadow': `2px 2px 2px ${chauffeur.color}`
                          }
                        }
                      };
                    } else {
                      if (inAttenteLoop) {
                        prevObjectAttente = {
                          id: Math.floor((Math.random() * 9999999) + 1),
                          chauffeur: dataTrajet[0].DGPCOND,
                          origineHeure: origineHeureTemp,
                          endHeure: dataTrajetHeure[index],
                          coords: {
                            latitude: Number(gpsFormat[0]),
                            longitude: Number(gpsFormat[1])
                          },
                          options: {
                            icon: {
                              url: "images/ICO/ico_attente.svg"
                            },
                            animation: maps.Animation.Hp,
                            labelAnchor: '20 40',
                            labelClass: "labels",
                            labelStyle: {
                              'box-shadow': `2px 2px 2px ${chauffeur.color}`
                            }
                          }
                        };
                      } else {
                        origineHeureTemp = dataTrajetHeure[index];
                        prevObjectAttente = {
                          id: Math.floor((Math.random() * 9999999) + 1),
                          chauffeur: dataTrajet[0].DGPCOND,
                          origineHeure: origineHeureTemp,
                          endHeure: dataTrajetHeure[index],
                          coords: {
                            latitude: Number(gpsFormat[0]),
                            longitude: Number(gpsFormat[1])
                          },
                          options: {
                            icon: {
                              url: "images/ICO/ico_attente.svg"
                            },
                            animation: maps.Animation.Hp,
                            labelAnchor: '20 40',
                            labelClass: "labels",
                            labelStyle: {
                              'box-shadow': `2px 2px 2px ${chauffeur.color}`
                            }
                          }
                        };
                      }
                      inAttenteLoop = true;
                    }
                    if (dataTrajetGps.length === index + 1) {
                      const origineHeureSplit = prevObjectAttente.origineHeure.split(":");
                      const endHeureSplit = prevObjectAttente.endHeure.split(":");
                      const startDate = new Date(0, 0, 0, origineHeureSplit[0], origineHeureSplit[1]);
                      const endDate = new Date(0, 0, 0, endHeureSplit[0], endHeureSplit[1]);

                      const millis = endDate - startDate;
                      const minutes = millis / 1000 / 60;
                      if (minutes > 10) {
                        prevObjectAttente.options.labelContent = `${minutes} minutes<br>${origineHeureTemp} à ${dataTrajetHeure[index]}`;
                        attenteArray.push(prevObjectAttente);
                      }
                    }
                  } else {
                    // this.log.info(`Plus de 150m`);
                    // if inAttenteLoop true
                    if (inAttenteLoop) {
                      inAttenteLoop = false;

                      const origineHeureSplit = prevObjectAttente.origineHeure.split(":");
                      const endHeureSplit = prevObjectAttente.endHeure.split(":");
                      const startDate = new Date(0, 0, 0, origineHeureSplit[0], origineHeureSplit[1]);
                      const endDate = new Date(0, 0, 0, endHeureSplit[0], endHeureSplit[1]);

                      const millis = endDate - startDate;
                      const minutes = millis / 1000 / 60;
                      if (minutes > 10) {
                        prevObjectAttente.options.labelContent = `${minutes} minutes<br>${origineHeureTemp} à ${dataTrajetHeure[index]}`;
                        attenteArray.push(prevObjectAttente);
                      }
                    }
                    // ne pas tenir compte du point gps
                    // prevObjectAttente.origineHeure = dataTrajetHeure[index];
                    // prevObjectAttente.coords.latitude = Number(gpsFormat[0]);
                    // prevObjectAttente.coords.longitude = Number(gpsFormat[1]);
                    prevObjectAttente = {
                      id: Math.floor((Math.random() * 9999999) + 1),
                      chauffeur: dataTrajet[0].DGPCOND,
                      origineHeure: dataTrajetHeure[index],
                      endHeure: dataTrajetHeure[index],
                      coords: {
                        latitude: Number(gpsFormat[0]),
                        longitude: Number(gpsFormat[1])
                      },
                      options: {
                        icon: {
                          url: "images/ICO/ico_attente.svg"
                        },
                        animation: maps.Animation.Hp,
                        labelAnchor: '20 40',
                        labelClass: "labels",
                        labelStyle: {
                          'box-shadow': `2px 2px 2px ${chauffeur.color}`
                        }
                      }
                    };
                  }
                });
                this.VariablesShare.addAttentes(attenteArray);
                deferred.resolve();
              });
            promises.push(deferred.promise);
          });
          this.q.all(promises).then(() => {
            resolve("getAttentes finish");
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
