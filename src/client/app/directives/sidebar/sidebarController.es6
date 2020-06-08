class SidebarController {

      constructor(Channels, Users, $scope) {
            this.Events = Events;
            this.Channels = Channels;

            // Setup properties
            this.channels = Channels.channelCollection;
            this.currentUser = Users.getUser();
            this.users = Users.activeUsers;

            // Setup watch on active channel
            const vm = this;
            vm.currentChannel = Channels.activeChannel;
            $scope.$watch(function() {
                  return Channels.activeChannel;
            }, function() {
                  vm.currentChannel = Channels.activeChannel;
            });
      }
      // Checks if the channel is currently active
      isActive(channel) {
            return this.currentChannel.id === channel.id;
      }

      // Sets the channel to active
      toggleChannel(channel) {
            this.Channels.setChannelForChannelID(channel.id);
      }
}

angular.module('WebChat').controller( 'SidebarController', SidebarController);
SidebarController.$inject = ['Channels', 'Users', '$scope'];
