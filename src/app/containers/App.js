class AppController {
  constructor() {
    this.todos = "toto";
  }
}

export const App = {
  template: require('./App.html'),
  controller: AppController
};
