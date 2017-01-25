export class getPositionsFun {
  constructor($log, $timeout, $q, $mdToast, uiGmapGoogleMapApi, api, diversFun, VariablesShare) {
    this.log = $log;
    this.q = $q;
    this.timeout = $timeout;
    this.mdToast = $mdToast;
    this.uiGmapGoogleMapApi = uiGmapGoogleMapApi;
    this.api = api;
    this.diversFun = diversFun;
    this.VariablesShare = VariablesShare;
  }

  getPositions(selectedChaufeurs, dateCalendar, typeMission) {
    return this.q((resolve, reject) => {
      try {
        this.uiGmapGoogleMapApi.then(maps => {
          const promises = [];
          // Get marker des differents chauffeurs select
          selectedChaufeurs.forEach(chauffeur => {
            const deferred = this.q.defer();
            this.api.loadPositions(chauffeur.SALCODE, this.diversFun.convertDate(dateCalendar), typeMission)
              .then(dataPositions => {
                if (dataPositions.length > 0) {
                  dataPositions.forEach(pos => {
                    if (pos.CODEANO !== "PARTIC" && pos.CODEANO !== "FLASHAGE" && pos.POSGPS !== "") {
                      const posGps = pos.POSGPS.replace(",", ".").replace(",", ".");
                      const coords = posGps.split(";");
                      const heure = pos.DATESUIVI.split(" ");
                      const addPosition = {
                        id: Number(pos.ID),
                        numpos: pos.NUM,
                        coords: {
                          latitude: coords[0],
                          longitude: coords[1]
                        },
                        design: {
                          color: this.diversFun.getClassColor(pos.CODEANO),
                          ico: this.diversFun.getIco(pos.CODEANO)
                        },
                        options: {
                          icon: {
                            url: this.diversFun.getImg(pos.CODEANO)
                          },
                          animation: maps.Animation.Hp,
                          labelContent: heure[1],
                          labelAnchor: '20 40',
                          labelClass: "labels",
                          labelStyle: {
                            'box-shadow': `2px 2px 2px ${chauffeur.color}`
                          }
                        },
                        events: {
                          click: (marker, eventName, model) => {
                            model.show = !model.show;
                            this.log.log(model);
                          },
                          rightclick: () => {
                            this.log.log(pos.NUM);
                          }
                        },
                        info: {
                          codeano: pos.CODEANO,
                          libano: pos.LIBANO,
                          memo: pos.MEMO,
                          datesuivi: pos.DATESUIVI,
                          livnom: pos.LIVNOM,
                          nomclient: pos.NOMCLIENT,
                          expnom: pos.EXPNOM,
                          micode: pos.MICODE,
                          voydbx: pos.VOYBDX,
                          livadr: pos.LIVADR,
                          livcp: pos.LIVVILCP,
                          livville: pos.LIVVILLIB,
                          expadr: pos.EXPADR,
                          expcp: pos.EXPVILCP,
                          expville: pos.EXPVILLIB
                        },
                        infowindowOptions: {
                          url: "app/containers/infowindowTemplate.html",
                          param: {
                            num: pos.NUM
                          },
                          options: {
                            boxClass: "infobox",
                            content: "Text"
                          }
                        }
                      };
                      this.VariablesShare.addmarkers(addPosition);
                    }
                  });
                } else {
                  const toast = this.mdToast.simple()
                    .textContent(`Pas de données de positions pour ${chauffeur.SALNOM}`)
                    .action('X')
                    .highlightAction(true)
                    .position('top right');
                  this.mdToast.show(toast);
                }
                deferred.resolve();
              });
            promises.push(deferred.promise);
          });
          this.q.all(promises).then(() => {
            resolve("getPosition finish");
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
