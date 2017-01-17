class AppController {
  constructor($scope, $log, VariablesShare) {
    // Promises
    $scope.Promise = VariablesShare.Promises;
    $scope.$watch('getPositionPromise', () => {
      $log.info(`tg ${$scope.getPositionPromise}`);
    });
  }
}

export const App = {
  template: require('./App.html'),
  controller: AppController
};
