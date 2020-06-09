angular.module('SecretSocietyChat').directive('conversationHeader',[function() {
return {
      restrict: 'E',
      templateUrl: 'app/directives/conversationHeader/conversationHeader.html',
      scope: {
            title: '@'
      }
}
}]);
