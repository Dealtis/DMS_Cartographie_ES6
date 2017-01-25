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

  getPredict(selectedChaufeurs) {
    return this.q((resolve, reject) => {
      try {
        this.uiGmapGoogleMapApi.then(maps => {
          const promises = [];
          const failGeocode = [];
          selectedChaufeurs.forEach(chauffeur => {
            const deferred = this.q.defer();
            this.api.loadPredict(chauffeur.NOMANDSOFT)
              .then(dataPredict => {
                this.log.log(dataPredict);
                const schProgressbar = this.VariablesShare.progressBars.find(progressBar => {
                  return progressBar.chauffeur === chauffeur.SALNOM;
                });
                dataPredict.forEach(item => {
                  if (item.OTPOTSNUM !== "") {
                    const schPos = schProgressbar.positionsAll.find(pBar => {
                      return item.OTPOTSNUM === pBar.num;
                    });
                    if (angular.isUndefined(schPos)) {
                      let nom = "";
                      let adr = "";
                      let cp = "";
                      let ville = "";
                      if (item.OTPTRSCODE === "LIV") {
                        nom = item.OTPARRNOM;
                        adr = item.OTPARRADR1;
                        cp = item.OTPARRUSRVILCP;
                        ville = item.OTPARRUSRVILLIB;
                      } else {
                        nom = item.OTPDEPNOM;
                        adr = item.OTPDEPADR1;
                        cp = item.OTPDEPUSRVILCP;
                        ville = item.OTPDEPUSRVILLIB;
                      }

                      this.api.getGeocode(nom, adr, cp, ville)
                        .then(response => {
                          this.log.log(item.OTPTRSCODE);
                          if (response.status === "ZERO_RESULTS") {
                            const failGeo = {
                              nomFail: nom,
                              adrFail: adr,
                              cpFail: cp,
                              villeFail: ville
                            };
                            failGeocode.push(failGeo);
                          } else {
                            const schChauffPos = this.VariablesShare.markerLastPos.find(marker => {
                              return chauffeur.SALCODE === marker.id;
                            });
                            this.log.log(schChauffPos);
                            this.api.getMatrix(`${schChauffPos.coords.latitude},${schChauffPos.coords.longitude}`, `${response.results[0].geometry.location.lat},${response.results[0].geometry.location.lng}`)
                              .then(dataMatrix => {
                                const duration = dataMatrix.routes[0].legs[0].duration.text;
                                const newPredict = {
                                  id: item.OTPID,
                                  numpos: item.OTPOTSNUM,
                                  points: dataMatrix.routes[0].overview_polyline.points,
                                  coords: {
                                    latitude: response.results[0].geometry.location.lat,
                                    longitude: response.results[0].geometry.location.lng
                                  },
                                  options: {
                                    icon: {
                                      url: this.diversFun.getImg(item.OTPTRSCODE)
                                    },
                                    animation: maps.Animation.Hp,
                                    labelContent: `${nom} ${ville}<br>à ${duration}`,
                                    labelAnchor: '20 40',
                                    labelClass: "labels",
                                    labelStyle: {
                                      'box-shadow': `2px 2px 2px ${chauffeur.color}`
                                    }
                                  },
                                  events: {
                                    mouseover: () => {
                                      const trajetMatrix = maps.geometry.encoding.decodePath(dataMatrix.routes[0].overview_polyline.points);
                                      const pathGpsArray = [];
                                      trajetMatrix.forEach(marker => {
                                        pathGpsArray.push({
                                          latitude: Number(marker.lat()),
                                          longitude: Number(marker.lng())
                                        });
                                      });
                                      const polylines = {
                                        id: 99,
                                        path: pathGpsArray,
                                        stroke: {
                                          color: "#2196f3",
                                          weight: 2.5
                                        },
                                        editable: false,
                                        draggable: false,
                                        geodesic: true,
                                        visible: true,
                                        icons: [{
                                          icon: {
                                            path: maps.SymbolPath.FORWARD_OPEN_ARROW
                                          },
                                          offset: '25px',
                                          repeat: '200px'
                                        }]
                                      };
                                      this.VariablesShare.addTrajetMatrix(polylines);
                                    },
                                    mouseout: () => {
                                      this.VariablesShare.cleanTrajetMatrix();
                                    }
                                  },
                                  info: {
                                    nomPre: nom,
                                    adrPre: adr,
                                    cpPre: cp,
                                    villePre: ville
                                  }
                                };
                                this.VariablesShare.addPredict(newPredict);
                              });
                          }
                          deferred.resolve(dataPredict);
                        });
                    } else {
                      deferred.resolve();
                    }
                  }
                });
              });
            promises.push(deferred.promise);
          });

          this.q.all(promises).then(() => {
            // const toast = this.mdToast.simple()
            //   .textContent(`Pas de prédictions`)
            //   .action('X')
            //   .highlightAction(true)
            //   .position('top right')
            //   .hideDelay(2000);
            // this.mdToast.show(toast);

            this.timeout(() => {
              let failName = '';
              if (failGeocode.length > 0) {
                failGeocode.forEach(fail => {
                  failName = `${failName} ${fail.nomFail}`;
                });
                const toast = this.mdToast.simple()
                  .textContent(`Pas de résultat pour${failName}`)
                  .action('X')
                  .highlightAction(true)
                  .position('top right')
                  .hideDelay(7000);
                this.mdToast.show(toast);
              }
            }, 500);
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
