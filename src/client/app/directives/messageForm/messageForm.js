angular.module('WebChat').directive('messageForm', ['$http','Events',   function($http, Events, Channels) {
      return {
            restrict: 'E',
            templateUrl: 'app/directives/messageForm/messageForm.html',
            controller: MessageFormController,
            controllerAs: 'messageFormCtrl',
            replace: true
      }
}]);
