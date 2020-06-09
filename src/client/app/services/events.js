'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Events = function () {
      function Events(Users, socket, $http, SocketEvent, Notifications, Channels) {
            _classCallCheck(this, Events);

            // Setup dependencies
            this.Users = Users;
            this.socket = socket;
            this.$http = $http;
            this.SocketEvent = SocketEvent;
            this.Notifications = Notifications;
            this.Channels = Channels;
            // Set active channel
            Channels.setChannelForChannelID('secretsocietychat');
            // Register to receive socket messages
            this.registerSocketEvents();
            // Get existing users already connected
            this.getExistingActiveUsers();
      }

      // Register callbacks for all the socket events emitted from the server


      _createClass(Events, [{
            key: 'registerSocketEvents',
            value: function registerSocketEvents() {
                  var self = this;
                  var socket = this.socket;
                  var SocketEvent = this.SocketEvent;
                  // Register socket event
                  socket.on(SocketEvent.NEW_MESSAGE, function (data) {
                        self.receiveMessage(data);
                  });

                  socket.on(SocketEvent.USER_JOINED, function (data) {
                        self.userJoined(data);
                  });

                  socket.on(SocketEvent.USER_LEFT, function (data) {
                        self.userLeft(data);
                  });

                  socket.on(SocketEvent.USER_TYPING, function (data) {
                        self.userStartedTyping(data);
                  });

                  socket.on(SocketEvent.USER_STOPPED_TYPING, function (data) {
                        self.userStoppedTyping(data);
                  });

                  socket.on(SocketEvent.RECONNECT, function (data) {
                        console.log('Reconnected...');
                  });
            }

            // Gets currently active users from server

      }, {
            key: 'getExistingActiveUsers',
            value: function getExistingActiveUsers() {
                  var self = this;
                  this.$http({ method: 'get', url: '/users' }).then(function successCallback(response) {
                        var users = response.data;
                        // self.removeUserWithUsername(user.name, users);
                        self.activeUsers = users;
                        self.hasDownloadUsers = true;
                        var currentUsername = self.Users.getUser().name;
                        // Remove current user from list
                        users = users.filter(function (user) {
                              return user.name != currentUsername;
                        });
                        // Create a DMChannel for each user
                        self.Channels.addDMChannelsForUsers(users);
                  });
            }

            // Sends a typing notification to users in current conversation

      }, {
            key: 'sendTypingNotification',
            value: function sendTypingNotification() {
                  var data = { channel: this.Channels.activeChannel.id, user: this.Users.getUser(), type: 'user_typing' };
                  this.socket.emit(this.SocketEvent.USER_TYPING, data);
            }
      }, {
            key: 'sendStopTypingNotification',


            // Sends a stop typing notification to users in current conversation
            value: function sendStopTypingNotification() {
                  var data = { channel: this.Channels.activeChannel.id, user: this.Users.getUser(), type: 'user_stopped_typing' };
                  this.socket.emit(this.SocketEvent.USER_STOPPED_TYPING, data);
            }

            // Send Messages

      }, {
            key: 'sendMessage',
            value: function sendMessage(text) {

                  console.log('Sending Message ' + message);
                  var message = new Message(text, this.Users.getUser());
                  // Add message
                  this.Channels.addMessageToChannelWithID(message);

                  message.setChannelID(this.Channels.activeChannel.id);
                  var serverMessage = {
                        message: { text: text }
                  };

                  serverMessage['channel'] = this.Channels.activeChannel.id;
                  this.socket.emit(this.SocketEvent.NEW_MESSAGE, serverMessage);
            }

            // Receive Message from other user

      }, {
            key: 'receiveMessage',
            value: function receiveMessage(data) {
                  console.log('Receiving Message');
                  var text = data.message.text;
                  var message = new Message(text, data.user, data.createdAt);

                  this.Channels.addMessageToChannelWithID(message, data.channel);
                  this.Notifications.send(message.user.name + ': ' + message.text);
            }

            // Convenience method to show notification and post system message for text

      }, {
            key: 'showNotification',
            value: function showNotification(text) {
                  var message = new NotificationMessage(text);
                  this.Channels.addMessageToChannelWithID(message);
                  this.Notifications.send(text);
            }

            // Called when user has joined

      }, {
            key: 'userJoined',
            value: function userJoined(data) {
                  console.log(data.username + ' joined');
                  // Append to active users if not current user
                  if (data.username !== this.Users.getUser().name) {
                        // Add user to active users
                        var joinedUser = new User(data.username);
                        this.Users.addUser(joinedUser);
                        // Create a channel for user
                        var dmChannel = this.Channels.createDMChannelForUser(joinedUser);
                        // Add channel
                        this.Channels.addChannel(dmChannel);
                        // Show notification
                        var userJoinedMessage = 'Welcome ' + data.username + ' joining the secret service society';
                        this.showNotification(userJoinedMessage);
                        return true;
                  } else {
                        return false;
                  }
            }

            // Called when user left the chat room

      }, {
            key: 'userLeft',
            value: function userLeft(data) {
                  // Remove user
                  this.Users.removeUserWithUsername(data.username);
                  // Remove channel
                  var dmChannelID = DMChannel.idForUsernames(this.Users.user.name, data.username);
                  this.Channels.removeChannelWithID(dmChannelID);
                  // Send notification
                  var leftMessage = data.username + ' left';
                  this.showNotification(leftMessage);
            }

            // Called when server sends user started typing message

      }, {
            key: 'userStartedTyping',
            value: function userStartedTyping(data) {
                  var name = data.user.name;
                  this.Channels.channels[data.channel].status = name + ' is typing...';
            }
      }, {
            key: 'userStoppedTyping',
            // Called when server sends user stopped typing message
            value: function userStoppedTyping(data) {
                  this.Channels.channels[data.channel].status = '';
            }
      }]);

      return Events;
}();

angular.module('SecretSocietyChat').service('Events', Events);
Events.$inject = ['Users', 'socket', '$http', 'SocketEvent', 'Notifications', 'Channels'];
