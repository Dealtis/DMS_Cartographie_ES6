class ToolBarController {
  constructor() {
    this.text = 'My brand new component!';
  }
}

export const toolBar = {
  templateUrl: 'app/components/toolBar.html',
  controller: ToolBarController
};
