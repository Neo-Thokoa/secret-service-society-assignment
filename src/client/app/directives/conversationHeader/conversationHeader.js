angular.module('WebChat').directive('conversationHeader',[function() {
return {
      restrict: 'E',
      templateUrl: 'app/directives/conversationHeader/conversationHeader.html',
      scope: {
            title: '@'
      }
}
}]);
