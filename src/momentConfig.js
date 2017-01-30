import moment from 'moment';

export default momentConfig;
/** @ngInject */
function momentConfig($mdDateLocaleProvider) {
  $mdDateLocaleProvider.months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  $mdDateLocaleProvider.shortMonths = ['janv', 'févr', 'mars', 'avri', 'mai', 'juin', 'juill', 'août', 'sept', 'octo', 'nove', 'déce'];
  $mdDateLocaleProvider.days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  $mdDateLocaleProvider.shortDays = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
  $mdDateLocaleProvider.firstDayOfWeek = 1;
  $mdDateLocaleProvider.formatDate = date => {
    return moment(date).format('DD/MM/YYYY');
  };
  $mdDateLocaleProvider.weekNumberFormatter = weekNumber => {
    return `Semaine ${weekNumber}`;
  };
  $mdDateLocaleProvider.msgCalendar = 'Calendrier';
  $mdDateLocaleProvider.msgOpenCalendar = 'Ouvrir le calendrier';
}
