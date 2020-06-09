angular.module('SecretSocietyChat').controller( 'ChatController', [ 'Events', 'Channels', '$scope', function( Events, Channels, $scope ) {

      var vm = this;
      vm.channel = Channels.activeChannel;

      $scope.$watch(function() 
      {
            return Channels.activeChannel;
      }, function() 
      {
            vm.channel = Channels.activeChannel;
      });

}]);
