'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SidebarController = function () {
      function SidebarController(Channels, Users, $scope) {
            _classCallCheck(this, SidebarController);

            this.Events = Events;
            this.Channels = Channels;

            // Setup properties
            this.channels = Channels.channelCollection;
            this.currentUser = Users.getUser();
            this.users = Users.activeUsers;

            // Setup watch on active channel
            var vm = this;
            vm.currentChannel = Channels.activeChannel;
            $scope.$watch(function () {
                  return Channels.activeChannel;
            }, function () {
                  vm.currentChannel = Channels.activeChannel;
            });
      }
      // Checks if the channel is currently active


      _createClass(SidebarController, [{
            key: 'isActive',
            value: function isActive(channel) {
                  return this.currentChannel.id === channel.id;
            }

            // Sets the channel to active

      }, {
            key: 'toggleChannel',
            value: function toggleChannel(channel) {
                  this.Channels.setChannelForChannelID(channel.id);
            }
      }]);

      return SidebarController;
}();

angular.module('SecretSocietyChat').controller('SidebarController', SidebarController);
SidebarController.$inject = ['Channels', 'Users', '$scope'];