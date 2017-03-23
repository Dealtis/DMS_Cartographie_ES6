import _ from 'lodash';

class MessageToolbarController {
  /* @ngInject */
  constructor($scope, $document, $interval, $timeout, $parse, $mdToast, $cookies, $log, $element, VariablesShare, api, ngAudio) {
    $element.find('input').on('keydown', ev => {
      ev.stopPropagation();
    });
    angular.element(document).ready(() => {
      $document[0].querySelector('.messagetoolbar_newmessage_select_chauffeurs').querySelector("md-select").addEventListener('focus', () => {
        if (angular.isDefined($scope.selectedChauffeurs)) {
          if ($scope.selectedChauffeurs.length > 0) {
            $document[0].querySelector('.messagetoolbar_newmessage_input').querySelector("input").focus();
          }
        }
      }, true);
    });

    $scope.messageNonlu = VariablesShare.messagesNonlu;
    $scope.messageArchive = [];
    $scope.messageLoad = [];
    $scope.chauffeurs = VariablesShare.chauffeurs;
    $scope.forminput = {};
    $scope.messagetoolbarInputmessageActive = false;
    api.loadMessages(VariablesShare.socID, '60', '2').then(dataMessages => {
      dataMessages.forEach(message => {
        const newMessage = {
          id: Number(message.DMEID),
          chauffeur: message.DMECODECHAUF,
          text: message.DMEMESSAGE,
          datereception: message.DMEDATERECU,
          isLu: false
        };
        $scope.messageLoad.push(newMessage);
        VariablesShare.addMessage(newMessage);
      });
      if ($scope.messageNonlu.length > 0) {
        // if mute
        if ($cookies.get('isSoundMuted') === "false") {
          const sound = ngAudio.load('assets/sounds/newmessage.mp3');
          sound.play();
        }
      }
    });

    $scope.cancelSelected = () => {
      $scope.selectedChauffeurs.length = 0;
    };

    $scope.sendMessage = (chauffeurs, message) => {
      const dataChauffeur = [];
      chauffeurs.forEach(chauffeur => {
        dataChauffeur.push(chauffeur.NOMANDSOFT);
      });
      let emetteurCookie = "unknown";
      emetteurCookie = $cookies.get("USRLOGIN");
      const dataMessage = {
        emetteur: emetteurCookie,
        chauffeurs: dataChauffeur,
        textMessage: message,
        typeMessage: 1
      };
      api.postMessages(dataMessage);
      $scope.Textmessage = "";
    };

    $scope.sendMessageReply = (chauffeur, message) => {
      if (angular.isDefined(message)) {
        let emetteurCookie = "unknown";
        emetteurCookie = $cookies.get("USRLOGIN");
        const dataMessage = {
          emetteur: emetteurCookie,
          chauffeurs: [chauffeur],
          textMessage: message,
          typeMessage: 1
        };
        api.postMessages(dataMessage).then(result => {
          $log.log(result);
          if (result === true) {
            const toast = $mdToast.simple()
              .textContent(`Message envoyé à ${chauffeur}`)
              .action('X')
              .highlightAction(true)
              .position('top right');
            $mdToast.show(toast);
            $scope.forminput = {};
          } else {
            const toast = $mdToast.simple()
              .textContent(`Une erreur est survenue, veuillez réessayer`)
              .action('X')
              .highlightAction(true)
              .position('bottom right');
            $mdToast.show(toast);
          }
        });
      } else {
        const toast = $mdToast.simple()
          .textContent(`Pas de message`)
          .action('X')
          .highlightAction(true)
          .position('bottom right');
        $mdToast.show(toast);
      }
    };

    $interval(() => {
      api.loadMessages(VariablesShare.socID, '15', '2').then(dataMessages => {
        dataMessages.forEach(message => {
          const newMessage = {
            id: Number(message.DMEID),
            chauffeur: message.DMECODECHAUF,
            text: message.DMEMESSAGE,
            datereception: message.DMEDATERECU,
            isLu: false
          };
          // isMessage in messageLoad
          const schMsg = _.find($scope.messageLoad, msg => {
            return msg.id === newMessage.id;
          });
          if (angular.isUndefined(schMsg)) {
            VariablesShare.addMessage(newMessage);
          }
        });
        if (VariablesShare.messagesNonlu.length > 0) {
          // if mute
          if ($cookies.get('isSoundMuted') === "false") {
            const sound = ngAudio.load('assets/sounds/newmessage.mp3');
            sound.play();
          }
        }
      });
    }, 120000);

    $scope.markAsRead = id => {
      $scope.messageNonlu.forEach((message, index) => {
        if (message.id === id) {
          $scope.messageNonlu.splice(index, 1);
          message.isLu = true;
        }
      });
      if ($scope.messageNonlu.length === 0) {
        $scope.messagetoolbarActive = false;
      }
      VariablesShare.messagesNonlu = $scope.messageNonlu;
    };

    $scope.loadMessagesArchive = loadMessagesArchive;

    function loadMessagesArchive() {
      $scope.messageArchiveRecu = [];
      $scope.messageArchiveEmis = [];

      $scope.messageArchivePromise = api.loadMessages(VariablesShare.socID, '1440', '2').then(dataMessages => {
        dataMessages.forEach(message => {
          const newMessage = {
            id: Number(message.DMEID),
            chauffeur: message.DMECODECHAUF,
            text: message.DMEMESSAGE,
            datereception: message.DMEDATERECU,
            isLu: false
          };
          $scope.messageArchiveRecu.push(newMessage);
        });
        $scope.messageArchiveAllRecu = $scope.messageArchiveRecu;
        if (angular.isDefined($scope.selectedChauffeursRecu)) {
          $scope.messageArchiveRecu = _.filter($scope.messageArchiveAllRecu, {
            chauffeur: $scope.selectedChauffeursRecu.NOMANDSOFT
          });
          if ($scope.messageArchiveRecu.length === 0) {
            $scope.messageArchiveRecu.push({
              id: 666,
              text: `Aucun message de ${$scope.selectedChauffeursRecu.NOMANDSOFT}`,
              isLu: false
            });
          }
        }
      });

      $scope.messageArchiveEmisPromise = api.loadMessages(VariablesShare.socID, '1440', '1').then(dataMessages => {
        dataMessages.forEach(message => {
          const newMessage = {
            id: Number(message.DMEID),
            chauffeur: message.DMECODECHAUF,
            text: message.DMEMESSAGE,
            isLu: false
          };
          if (message.DMEDATELU === "") {
            newMessage.datereception = `Non lu`;
          } else {
            newMessage.datereception = `lu à ${message.DMEDATELU}`;
          }
          $scope.messageArchiveEmis.push(newMessage);
        });

        $scope.messageArchiveAllEmis = $scope.messageArchiveEmis;
        if (angular.isDefined($scope.selectedChauffeursEmis)) {
          $scope.messageArchiveEmis = _.filter($scope.messageArchiveAllEmis, {
            chauffeur: $scope.selectedChauffeursEmis.NOMANDSOFT
          });
        }

        if ($scope.switch_nonlu) {
          $scope.messageArchiveEmis = _.filter($scope.messageArchiveEmis, {
            datereception: "Non lu"
          });
          if ($scope.messageArchiveEmis.length === 0) {
            $scope.messageArchiveEmis.push({
              id: 666,
              text: `Aucun message de ${$scope.selectedChauffeursEmis.NOMANDSOFT}`,
              isLu: false
            });
          }
        }
      });
    }

    $scope.$watch('selectedChauffeursRecu', () => {
      if (angular.isDefined($scope.selectedChauffeursRecu)) {
        if ($scope.selectedChauffeursRecu === "Tous") {
          $scope.messageArchiveRecu = [];
          $scope.messageArchiveRecu = $scope.messageArchiveAllRecu;
        } else {
          $scope.messageArchiveRecu = _.filter($scope.messageArchiveAllRecu, {
            chauffeur: $scope.selectedChauffeursRecu.NOMANDSOFT
          });
          if ($scope.messageArchiveRecu.length === 0) {
            $scope.messageArchiveRecu.push({
              id: 666,
              text: `Aucun message de ${$scope.selectedChauffeursRecu.NOMANDSOFT}`,
              isLu: false
            });
          }
        }
      }
    });

    $scope.$watch('selectedChauffeursEmis', () => {
      if (angular.isDefined($scope.selectedChauffeursEmis)) {
        if ($scope.selectedChauffeursEmis === "Tous") {
          $scope.messageArchiveEmis = [];
          $scope.messageArchiveEmis = $scope.messageArchiveAllEmis;
          if ($scope.switch_nonlu) {
            $scope.messageArchiveEmis = _.filter($scope.messageArchiveEmis, {
              datereception: "Non lu"
            });
          }
        } else {
          $scope.messageArchiveEmis = _.filter($scope.messageArchiveAllEmis, {
            chauffeur: $scope.selectedChauffeursEmis.NOMANDSOFT
          });
          if ($scope.switch_nonlu) {
            $scope.messageArchiveEmis = _.filter($scope.messageArchiveEmis, {
              datereception: "Non lu"
            });
          }
          if ($scope.messageArchiveEmis.length === 0) {
            $scope.messageArchiveEmis.push({
              id: 666,
              text: `Aucun message de ${$scope.selectedChauffeursEmis.NOMANDSOFT}`,
              isLu: false
            });
          }
        }
      }
    });

    $scope.filterNonlu = bool => {
      if (bool) {
        $scope.messageArchiveEmis = _.filter($scope.messageArchiveEmis, {
          datereception: "Non lu"
        });
        if ($scope.messageArchiveEmis.length === 0) {
          $scope.messageArchiveEmis.push({
            id: 666,
            text: `Aucun message de ${$scope.selectedChauffeursEmis.NOMANDSOFT}`,
            isLu: false
          });
        }
      } else {
        $scope.messageArchiveEmis = $scope.messageArchiveAllEmis;
        if (angular.isDefined($scope.selectedChauffeursEmis)) {
          if ($scope.selectedChauffeursEmis !== "Tous") {
            $scope.messageArchiveEmis = _.filter($scope.messageArchiveAllEmis, {
              chauffeur: $scope.selectedChauffeursEmis.NOMANDSOFT
            });
            if ($scope.messageArchiveEmis.length === 0) {
              $scope.messageArchiveEmis.push({
                id: 666,
                text: `Aucun message de ${$scope.selectedChauffeursEmis.NOMANDSOFT}`,
                isLu: false
              });
            }
          }
        }
      }
    };
  }
}

export const messageToolbar = {
  template: require('./messageToolbar.html'),
  controller: MessageToolbarController
};
