function adminKey($document) {
  return {
    restrict: 'A',
    link: ($scope, element, $timeout, $log) => {
      let keys = '';
      const code = '38384040373937396665';
      let timer = null;
      const success = () => {
        $log.log("sucess");
      };
      const cleanup = () => {
        clearTimeout(timer);

        keys = '';
      };
      const keyup = event => {
        clearTimeout(timer);

        keys += event.which;

        timer = $timeout(cleanup, 1000);

        if (keys === code) {
          success();
        }
      };

      $document.off('keyup', keyup).on('keyup', keyup);
    }
  };
}

export default adminKey;
