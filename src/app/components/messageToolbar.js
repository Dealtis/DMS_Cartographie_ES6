class MessageToolbarController {
  /* @ngInject */
  constructor($scope, $interval, $timeout, $parse, $mdToast, $cookies, $log, $element, VariablesShare, api, ngAudio) {
    $element.find('input').on('keydown', ev => {
      ev.stopPropagation();
    });
    $scope.messageNonlu = VariablesShare.messagesNonlu;
    $scope.messageArchive = [];
    $scope.chauffeurs = VariablesShare.chauffeurs;
    $scope.forminput = {};
    $scope.messagetoolbarInputmessageActive = false;
    api.loadMessages($cookies.get('SOCID'), '60', '2').then(dataMessages => {
      dataMessages.forEach(message => {
        const newMessage = {
          id: Number(message.DMEID),
          chauffeur: message.DMECODECHAUF,
          text: message.DMEMESSAGE,
          datereception: message.DMEDATERECU,
          isLu: false
        };
        VariablesShare.addMessage(newMessage);
      });
      if (VariablesShare.messagesNonlu.length > 0) {
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
      api.loadMessages($cookies.get('SOCID'), '2', '2').then(dataMessages => {
        dataMessages.forEach(message => {
          const newMessage = {
            id: Number(message.DMEID),
            chauffeur: message.DMECODECHAUF,
            text: message.DMEMESSAGE,
            datereception: message.DMEDATERECU,
            isLu: false
          };
          VariablesShare.addMessage(newMessage);
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
        }
      });
      if ($scope.messageNonlu.length === 0) {
        $scope.messagetoolbarActive = false;
      }
      VariablesShare.messagesNonlu = $scope.messageNonlu;
    };
    $scope.loadMessagesArchive = loadMessagesArchive;

    function loadMessagesArchive() {
      $scope.messageArchive = [];
      $scope.messageArchiveEmis = [];
      $scope.messageArchivePromise = api.loadMessages($cookies.get('SOCID'), '1440', '2').then(dataMessages => {
        dataMessages.forEach(message => {
          const newMessage = {
            id: Number(message.DMEID),
            chauffeur: message.DMECODECHAUF,
            text: message.DMEMESSAGE,
            datereception: message.DMEDATERECU,
            isLu: false
          };
          $scope.messageArchive.push(newMessage);
        });
      });
      $scope.messageArchivePromise = api.loadMessages($cookies.get('SOCID'), '1440', '1').then(dataMessages => {
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
      });
    }
  }
}

export const messageToolbar = {
  template: require('./messageToolbar.html'),
  controller: MessageToolbarController
};
