class MessageToolbarController {
  constructor($scope, $interval, $timeout, $parse, $mdToast, $cookies, $log, $element, VariablesShare, api, ngAudio) {
    $element.find('input').on('keydown', ev => {
      ev.stopPropagation();
    });
    $scope.messageNonlu = VariablesShare.messagesNonlu;
    $scope.messageArchive = [];
    $scope.chauffeurs = VariablesShare.chauffeurs;
    $scope.forminput = {};
    $scope.messagetoolbarInputmessageActive = false;
    api.loadMessages('73', '60').then(dataMessages => {
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
      $log.log(chauffeurs);
      $log.log(message);
      $scope.Textmessage = "";
    };

    $scope.sendMessageReply = (chauffeurs, message, forminput) => {
      if (angular.isDefined(message)) {
        const toast = $mdToast.simple()
          .textContent(`Message envoyé à ${chauffeurs}`)
          .action('X')
          .highlightAction(true)
          .position('top right');
        $mdToast.show(toast);
        $log.log(forminput);
        $scope.forminput = {};
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
      api.loadMessages('73', '2').then(dataMessages => {
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
      $scope.messageArchivePromise = api.loadMessages('73', '1440').then(dataMessages => {
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
        $log.log($scope.messageArchive);
      });
    }
  }
}

export const messageToolbar = {
  templateUrl: 'app/components/messageToolbar.html',
  controller: MessageToolbarController
};
