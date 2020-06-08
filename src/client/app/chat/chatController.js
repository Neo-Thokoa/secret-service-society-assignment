angular.module('WebChat').controller( 'ChatController', [ 'Events', 'Channels', '$scope', function( Events, Channels, $scope ) {

      // Setup binding with activeChannel
      var vm = this;
      vm.channel = Channels.activeChannel;
      $scope.$watch(function() {
            return Channels.activeChannel;
      }, function() {
            vm.channel = Channels.activeChannel;
      });

}]);
