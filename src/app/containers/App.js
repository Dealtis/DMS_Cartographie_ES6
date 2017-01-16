class AppController {
  constructor() {
    this.todo = "lol";
  }
}

export const App = {
  template: require('./App.html'),
  controller: AppController
};
