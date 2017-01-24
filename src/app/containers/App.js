class AppController {
  constructor($scope, $log, $templateCache, VariablesShare) {
    // Promises
    $scope.Promise = VariablesShare.Promises;

    // Templates
    $templateCache.put('templateId.html', 'This is the content of the template');
  }
}

export const App = {
  template: require('./App.html'),
  controller: AppController
};
