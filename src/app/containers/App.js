class AppController {
  constructor($scope, $log, VariablesShare) {
    // Promises
    $scope.Promise = VariablesShare.Promises;
  }
}

export const App = {
  template: require('./App.html'),
  controller: AppController
};
