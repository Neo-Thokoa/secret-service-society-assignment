angular.module('SecretSocietyChat').directive('sidebar',   ['Channels','Users', function(Channels, Users) {
return {
      restrict: 'E',
      templateUrl: 'app/directives/sidebar/sidebar.html',
      controller: SidebarController,
      controllerAs: 'sidebarCtrl',
      replace: true,
}
}]);
