'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Channels = function () {
      function Channels(Users) {
            _classCallCheck(this, Channels);

            this.presetChannels = ['Secret Society Chat'];
            // currently active channel, this will be a reference to an object in channels
            this.activeChannel = {};

            this.channels = {};
            this.channelCollection = [];
            this.Users = Users;
            // create and add channels for all preset channels
            this.addChannelsWithNames(this.presetChannels);
      }

      // Convenience function to create a channel for each name in names


      _createClass(Channels, [{
            key: 'addChannelsWithNames',
            value: function addChannelsWithNames(names) {
                  var _this = this;

                  // Create conversations
                  names.forEach(function (name) {
                        var channel = new Channel(name, name);
                        _this.addChannel(channel);
                  });
            }

            // Checks whether a channel with id exists in hash

      }, {
            key: 'hasChannelWithID',
            value: function hasChannelWithID(id) {
                  return this.channels.hasOwnProperty(id);
            }

            // Sets current active channel to channel with channelID

      }, {
            key: 'setChannelForChannelID',
            value: function setChannelForChannelID(channelID) {
                  this.activeChannel = this.channels[channelID];
                  if (this.activeChannel) {
                        this.activeChannel.markAsRead();
                  }
            }

            // Convenience function to create a direct message channel
            // between current user and a specific user

      }, {
            key: 'createDMChannelForUser',
            value: function createDMChannelForUser(user) {
                  return new DMChannel(this.Users.getUser(), user);
            }

            // Convenience function to which creates and adds a DMChannel for each user in users

      }, {
            key: 'addDMChannelsForUsers',
            value: function addDMChannelsForUsers(users) {
                  var self = this;
                  users.forEach(function (user) {
                        var userChannel = self.createDMChannelForUser(new User(user.name));
                        self.addChannel(userChannel);
                  });
            }

            // Adds a channel to hash channels

      }, {
            key: 'addChannel',
            value: function addChannel(channel) {
                  this.channels[channel.id] = channel;
                  this.channelCollection.push(this.channels[channel.id]);
            }

            // Removes a specific channel with channel id

      }, {
            key: 'removeChannelWithID',
            value: function removeChannelWithID(channelID) {
                  // Remove from hash
                  delete this.channels[channelID];
                  // Remove channel from array
                  for (var i = 0; i < this.channelCollection.length; i++) {
                        if (this.channelCollection[i].id === channelID) {
                              this.channelCollection.splice(i, 1);
                              break;
                        }
                  }
            }

            /**
             Adds a message to channel with ID
             If no channelID is provided, default to activeChannel
             */

      }, {
            key: 'addMessageToChannelWithID',
            value: function addMessageToChannelWithID(message) {
                  var channelID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.activeChannel.id;

                  this.channels[channelID].addMessage(message);
                  if (this.activeChannel.id !== channelID) {
                        // Update unreadCount
                        this.channels[channelID].unreadCount += 1;
                  }
            }
      }]);

      return Channels;
}();

angular.module('SecretSocietyChat').service('Channels', Channels);
Channels.$inject = ['Users'];
