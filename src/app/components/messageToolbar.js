class MessageToolbarController {
  constructor($scope, $interval, $timeout, $cookies, $log, $element, VariablesShare, api, ngAudio) {
    $element.find('input').on('keydown', ev => {
      ev.stopPropagation();
    });
    $scope.messageNonlu = VariablesShare.messagesNonlu;
    $scope.messageArchive = [];
    $scope.chauffeurs = VariablesShare.chauffeurs;
    api.loadMessages('73', '15').then(dataMessages => {
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
