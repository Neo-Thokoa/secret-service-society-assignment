(function() {
      angular.module('WebChat').directive('messageList', ['$http','Channels', function($http, Channels) {
      return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/directives/messageList/messageList.html',
            controller: function($http, Channels) {
                  this.channel = Channels.data;
            },
            controllerAs: 'ctrl',
      }
      }]);
})();
